$(document).ready(function () {
  $("#link-read-more-all-chat").bind("click", function () {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    $("#link-read-more-all-chat").attr("class", "d-none");
    $(".read-more-all-chat-loader").css("display", "inline-block");

    $.get(
      `/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,
      data => {
        if (data.leftSideData.trim() == "") {
          alertify.notify(
            "Bạn không còn không không còn cuộc trò chuyện nào để xem nữa cả.",
            "error",
            7
          );
          $("#link-read-more-all-chat").attr("class", "d-block");
          $(".read-more-all-chat-loader").css("display", "none");
          return false;
        }
        // Step 01: handle leftSide
        $("#all-chat").find("ul").append(data.leftSideData);

        // Step 02: handle scroll left
        resizeNineScrollLeft();
        nineScrollLeft();

        // Step 03: handle rightSide
        $("#screen-chat").append(data.rightSideData);

        // Step 04: Call function changeScreenChat
        changeScreenChat();

        // Step 05: Conver emoji
        convertEmoji();

        // Step 06: handle imageModal
        $("body").append(data.imageModalData);

        // Step 07: Call function gridPhotos
        gridPhotos();

        // Step 08: handle attachmentModal
        $("body").append(data.attachmentModalData);

        // Step 09: update status
        socket.emit("check-status");

        // Step 10: Remove loading
        $("#link-read-more-all-chat").attr("class", "d-block");
        $(".read-more-all-chat-loader").css("display", "none");

        // Step 11: Call readMoreMessage
        readMoreMessages();
      }
    );
  });
});
