function readMoreMessages() {
  $(".right .chat").scroll(function () {
    // get the first message
    let firstMessage = $(this).find(".bubble:first");
    // get position of the first messag e
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();

    if ($(this).scrollTop() == 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading">`;
      $(this).prepend(messageLoading);
      let targetId = $(this).data("chat");
      let skipMessage = $(this).find("div.bubble").length;
      let isChatGroup = $(this).hasClass("chat-in-group") ? true : false;
      $.get(
        `/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&isChatGroup=${isChatGroup}`,
        data => {
          if (data.rightSideData.trim() == "") {
            alertify.notify(
              "Bạn không còn không không còn cuộc trò chuyện nào để xem nữa cả.",
              "error",
              7
            );
            $(this).find("img.message-loading").remove();
            return false;
          }

          // Step 01: handle rightSide
          $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);

          // Step 02: prepend scroll
          $(`.right .chat[data-chat=${targetId}]`).scrollTop(
            firstMessage.offset().top - currentOffset
          );

          // Step 03: convert emoji
          convertEmoji();

          // Step 04: handle imageModal
          $(`imagesModal_${targetId}`)
            .find("div.all-images")
            .append(data.imageModalData);

          // Step 05: Call gridPhotos
          gridPhotos();

          // Step 06: handle attachmentModal
          $(`attachmentsModal_${targetId}`)
            .find(".list-attachments")
            .append(data.attachmentModalData);
          console.log({ attachmentModalData: data.attachmentModalData });
          // Step 07: remove message loading
          $(this).find("img.message-loading").remove();
        }
      );
    }
  });
}

$(document).ready(function () {
  readMoreMessages();
});
