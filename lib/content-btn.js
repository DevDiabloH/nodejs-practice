var btn = {
    form: function(text, query = ''){
      return `<a href="/${text}${query}">${text}</a>`;
    },
  
    create: function(){
      return this.form('create');
    },
  
    update: function(id){
      return this.form('update', `?id=${id}`)
    },
  
    delete: function(id){
      return this.form('delete', `?id=${id}`)
    }
}

module.exports = btn;
