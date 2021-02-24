var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url_query = require('url');
var pt = 8080;

function templateHTML(title, list, body, control){
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <p>${control}</p>
    <p>${body}</p>
    </body>
  </html>
  `;
}

function templateCreateFormHTML(title = '', desc = ''){
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Create</title>
    </head>
    <body>
      <form action="/create_process" method="POST">
        <p>
            <input type="text" name="title" placeholder="title" value="${title}"><br>
        </p>
        <p>
            <textarea name="description" placeholder="description">${desc}</textarea>
        </p>
        <p>
            <input type="submit" value="write">
            <input type="button" value="cancel" onclick="location.href='/'">
        </p>
      </form>
    </body>
  </html>
  `;
}

function templateUpdateFormHTML(title = '', desc = ''){
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Update</title>
    </head>
    <body>
      <form action="/update_process" method="POST">
        <p>
            <input type="text" name="title" placeholder="title" value="${title}" readonly>
        </p>
        <p>
            <textarea name="description" placeholder="description">${desc}</textarea>
        </p>
        <p>
            <input type="submit" value="write">
            <input type="button" value="cancel" onclick="location.href='/?id=${title}'">
        </p>
      </form>
    </body>
  </html>
  `;
}

function templateDeleteFormHTML(title = '', desc = ''){
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Delete</title>
    </head>
    <body>
      <form action="/delete_process" method="POST">
        <p>${title} 삭제하시겠습니까?</p>
        <input type="hidden" name="title" value=${title}>
        <p>
            <input type="submit" value="delete">
            <input type="button" value="cancel" onclick="location.href='/?id=${title}'">
        </p>
      </form>
    </body>
  </html>
  `;
}

function templateErrorHTML(stateCode, body){
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error</title>
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    <h1>${stateCode}</h1>
    <p>${body}</p>
    </body>
  </html>
  `;
}

function getTitleHTML(title){
  return `<h2>${title}</h2>`
}

function getDescHTML(desc){
  return `<p>${desc}</p>`;
}

function getCreateBtnHTML(){
  return `<a href="/create">create</a>`;
}

function getUpdateBtnHTML(id){
  return `<a href="/update?id=${id}">update</a>`;
}

function getDeleteBtnHTML(id){
  return `<a href="/delete?id=${id}">delete</a>`;
}

function templateList(files){
  var list = '<ul>';
    files.forEach(element => {
      var page = element.substr(5, element.length - 9);
      list += '<li><a href="/?id=' + page + '">' + page + '</a></li>'
    });

    list += '</ul>';
    return list;
}

function CreateContent(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });

  request.on('end', function(){
    var post = qs.parse(body);
    fs.writeFile(`./web_txt/desc_${post.title}.txt`, post.description, 'utf-8', function(err, data){
      list = templateList(fs.readdirSync(`./web_txt/`, 'utf-8'));
      response.writeHead(302, {Location: `/?id=${post.title}`});
      response.end();
    });
  });
}

function DeleteContent(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });

  request.on('end', function(){
    var post = qs.parse(body);
    var path = `./web_txt/desc_${post.title}.txt`;
    fs.access(path, fs.constants.F_OK, (err) => {
      if(err){
        console.log(`${path} can't delete.`);
        response.writeHead(400, {Location: `/?id=${post.title}`});
        response.end();
        return;
      }

      fs.unlink(path, (err) => {
        if(err) throw err;
        console.log(`${path} was deleted.`);
        response.writeHead(302, {Location: `/`});
        response.end();
      });

    });
  });
}

var app = http.createServer(function(req, res){
  var url = req.url;
  var nodeURL = new URL(__dirname + url);
  var param = nodeURL.searchParams;
  var list = templateList(fs.readdirSync(`./web_txt/`, 'utf-8'));
  var title = param.get('id');
  var description = '';

  function setContentText(_title, _description){
    title = _title;
    description = _description;
  }

  function ReadContent(){
    try{
      setContentText(title, fs.readFileSync(`./web_txt/desc_${title}.txt`, 'utf-8'));
      return true;
    }catch(err){
      return false;
    }
  };

  function View(stateCode, template){
    res.writeHead(stateCode);
    res.end(template);
  };

  if(url === '/'){  // HOME
    setContentText('Welcome', 'Node.js');
    View(200, templateHTML(title, list, `${getTitleHTML(title)}${getDescHTML(description)}`, getCreateBtnHTML()));
  }else if(url === '/create'){ // CREATE
    View(200, templateCreateFormHTML());
  }else if(url === '/create_process'){  // CREATE_COMPLETE
    CreateContent(req, res);
  }else if(url === `/update?id=${title}`){ // UPDATE
    fs.readFile(`./web_txt/desc_${title}.txt`, 'utf-8', function(err, data){
      if(err){
        View(404, templateErrorHTML(404, '404 this is not the web page you are looking for.'));
        return;
      }
      View(200, templateUpdateFormHTML(title, data));
    });
  }else if(url === `/update_process`){  // UPDATE_COMPLETE
    CreateContent(req, res);
  }else if(url === `/delete?id=${title}`){ // DELETE
    View(200, templateDeleteFormHTML(title))
  }else if(url === `/delete_process`){  // DELETE_COMPLETE
    DeleteContent(req, res);
  }else if(title !== undefined){  // VIEW CONTENT
    if(ReadContent()){
      View(200, templateHTML(title, list, `${getTitleHTML(title)}${getDescHTML(description)}`, `${getCreateBtnHTML()} ${getUpdateBtnHTML(title)} ${getDeleteBtnHTML(title)}`));
    }else{
      View(404, templateErrorHTML(404, '404 this is not the web page you are looking for.'));
    }
  }else{
    View(404, templateErrorHTML(404, '404 this is not the web page you are looking for.'));
  }
});
app.listen(pt);