var fs = require('fs');
var qs = require('querystring');

var crud = {
    create:function(request, response){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
    
      request.on('end', function(){
        var post = qs.parse(body);
        var path = `./web_txt/desc_${post.title}.txt`;
        fs.writeFile(path, post.description, 'utf-8', function(err, data){
          response.writeHead(302, {Location: `/?id=${post.title}`});
          response.end();
        });
      });
    },
  
    read:function(){
      // ?
    },
  
    update:function(request, response){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
    
      request.on('end', function(){
        var post = qs.parse(body);
        var path = `./web_txt/desc_${post.title}.txt`;
        fs.writeFile(path, post.description, 'utf-8', function(err, data){
          response.writeHead(302, {Location: `/?id=${post.title}`});
          response.end();
        });
      });
    },
  
    delete:function(request, response){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
    
      request.on('end', function(){
        var post = qs.parse(body);
        var path = `./web_txt/desc_${post.title}.txt`;
        fs.access(path, fs.constants.F_OK, (err) => {
          if(err){
            // file can't delete.
            response.writeHead(400, {Location: `/?id=${post.title}`});
            response.end();
            return;
          }
    
          fs.unlink(path, (err) => {
            if(err) throw err;
            // file deleted.
            response.writeHead(302, {Location: `/`});
            response.end();
        });
      });
     });
    }
}

module.exports = crud;