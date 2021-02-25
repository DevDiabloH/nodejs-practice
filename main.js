var http = require('http');
var fs = require('fs');
var pt = 8080;
var template = require('./lib/template.js');
var crud = require('./lib/content-crud.js');
var btn = require('./lib/content-btn.js');

var app = http.createServer(function(req, res){
  var url = req.url;
  var param = new URL(__dirname + url).searchParams;
  var title = param.get('id');
  var list = template.list(fs.readdirSync(`./web_txt/`, 'utf-8'));

  function View(stateCode, template){
    res.writeHead(stateCode);
    res.end(template);
  };

  if(url === '/'){  // HOME
    View(200, template.content('Welcome', list, 'Node.js', btn.create()));
  }else if(url === '/create'){ // CREATE
    View(200, template.createContentForm());
  }else if(url === '/create_process'){  // CREATE_COMPLETE
    crud.create(req, res);
  }else if(url === `/update?id=${title}`){ // UPDATE
    fs.readFile(`./web_txt/desc_${title}.txt`, 'utf-8', function(err, data){
      if(err){
        View(404, template.error()); 
        return;
      }
      View(200, template.updateContentForm(title, data));
    });
  }else if(url === `/update_process`){  // UPDATE_COMPLETE
    crud.update(req, res);
  }else if(url === `/delete?id=${title}`){ // DELETE
    View(200, template.deleteContentForm(title))
  }else if(url === `/delete_process`){  // DELETE_COMPLETE
    crud.delete(req, res);
  }else if(title !== undefined){  // VIEW CONTENT
    fs.readFile(`./web_txt/desc_${title}.txt`, 'utf-8', function(err, data){
      if(err){
        View(404, template.error()); 
        return;
      }
      View(200, template.content(title, list, data, `${btn.create()} ${btn.update(title)} ${btn.delete(title)}`));
    });
  }else{
    View(404, template.error());
  }
});
app.listen(pt);