var template = {
    content:function(title, list, desc, control){
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
        <p>${this.getTitleHTML(title)}${this.getDescHTML(desc)}</p>
        </body>
      </html>
      `;
    },
  
    createContentForm:function(title = '', desc = ''){
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
    },
  
    updateContentForm:function(title = '', desc = ''){
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
    },
  
    deleteContentForm:function(title = ''){
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
    },
    
    error:function(stateCode = 404, body = '404 this is not the web page you are looking for.'){
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
    },
  
    list:function(files){
      var outside = 'ul';
      var inside = 'li';
      var list = `<${outside}>`;
      files.forEach(element => {
        var page = element.substr(5, element.length - 9);
        list += `<${inside}><a href="/?id=${page}">${page}</a></${inside}>`
      });
  
      list += `</${outside}>`;
      return list;
    },
  
    getTitleHTML: function(t){
      return `<h2>${t}</h2>`
    },
  
    getDescHTML: function(t){
      return `<p>${t}</p>`;
    }
}

module.exports = template;