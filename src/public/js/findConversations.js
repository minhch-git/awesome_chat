function findConversations() {
  $("input.searchBox").on("input", function (e) {
    let keyword = $(this).val();
    if (!keyword) {
      $("#search-results").css("display", "none");
      return;
    }
  });

  $("input.searchBox")
    .unbind("keyup")
    .on("keyup", function (e) {
      if (e.which == 13) {
        let keyword = $(this).val();
        fetch(`/find-conversations/${keyword}`)
          .then(response => {
            if (!response.ok) throw response.json();
            return response.json();
          })
          .then(data => renderConversation(data))
          .catch(async ex => {
            const errors = await ex;
            $("#search-results").css("display", "block");
            $("#search-results")
              .find(".search_content ul")
              .empty()
              .append(`<li>${errors.message}</li>`);
          });
      }
    });
}

function renderConversation(conversations) {
  $("#search-results").css("display", "block");

  let itemRender = conversations.map(conversation => {
    let avatarSrc = conversation.avatar
      ? `images/users/${conversation.avatar}`
      : "images/users/group-avatar.png";
    return `
      <li data-chat="${conversation._id}">
        <img src="${avatarSrc}" /> ${
      conversation?.name || conversation?.username
    }
      </li>
    `;
  });
  $("#search-results").find(".search_content ul").empty().append(itemRender);
  showChat();
}

function showChat() {
  $("#search-results")
    .find("li")
    .unbind("click")
    .on("click", function (e) {
      let targetId = $(this).data("chat");
      $("ul.people").find(`a[data-target="#to_${targetId}"]`).click();
      $("#search-results").css("display", "none");
      $("input.searchBox").val("");
    });
}

$(document).ready(() => {
  findConversations();
});
