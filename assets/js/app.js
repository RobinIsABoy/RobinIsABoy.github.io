(function($, Hogan) {
  var App = {
    data: null,

    load: function(callback) {
      var self = this;
      if (this.data) {
        callback.call(self, self.data);
        return;
      }
      $.ajax({
        url: "main.json",
        type: "GET",
        dataType: "json",
        success: function(data) {
          self.data = data;
          data.posts.sort(function(a, b) {
            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
            return 0;
          });
          $("#title").html(data.name);
          callback.call(self, data);
        },
        error: function() {
          console.log("init error");
        }
      });
    },

    renderNav: function(pages) {
      var tmpl = Hogan.compile($("#pagesTemplate").html());
      $("#pages").append(tmpl.render({ pages: pages }));
    },

    renderContent: function(post) {
      var tags = [];
      if (post.tags) {
        var parts = post.tags.split(" ");
        for (var i = 0; i < parts.length; i++) {
          if (parts[i].length > 0) tags.push({ name: parts[i] });
        }
      }
      var tmpl = Hogan.compile($("#content").html());
      var html = tmpl.render({
        title: post.title,
        tags: tags,
        date: post.date
      });
      $("#main").prepend(html);
    },

    getPageIndex: function(pages, path) {
      for (var i = 0; i < pages.length; i++) {
        if (path === pages[i].path) return i;
      }
      return 0;
    }
  };

  window.App = App;
})(jQuery, Hogan);
