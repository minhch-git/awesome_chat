const socket = io();

function nineScrollLeft() {
  $(".left").niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: "#ECECEC",
    cursorwidth: "7px",
    scrollspeed: 50,
  });
}

function resizeNineScrollLeft() {
  $(".left").getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: "#ECECEC",
    cursorwidth: "7px",
    scrollspeed: 50,
  });
  $(`.right .chat[data-chat=${divId}]`).scrollTop(
    $(`.right .chat[data-chat=${divId}]`)[0].scrollHeight
  );
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: "top",
    filtersPosition: "bottom",
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        // Gán giá trị thay đổi vào thẻ input đã bị ẩn
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function () {
        // Bật lắng nghe DOM cho việc chat tin nhắn + emoji
        textAndEmojiChat(divId);

        // Bật chức năng người dùng đang gõ trò chuyện
        typingOn(divId);
      },
      blur: function () {
        // Tắt chức năng người dùng đang gõ trò chuyện
        typingOff(divId);
      },
    },
  });
  $(".icon-chat").bind("click", function (event) {
    event.preventDefault();
    $(".emojionearea-button").click();
    $(".emojionearea-editor").focus();
  });
}

function spinLoaded() {
  $(".master-loader").css("display", "none");
}

function spinLoading() {
  $("master-loader").css("display", "block");
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function () {
      spinLoading();
    })
    .ajaxStop(function () {
      spinLoaded();
    });
}

function showModalContacts() {
  $("#show-modal-contacts").click(function () {
    $(this).find(".noti_contact_counter").fadeOut("slow");
  });
}

function configNotification() {
  $("#noti_Button").click(function () {
    $("#notifications").fadeToggle("fast", "linear");
    $(".noti_counter").fadeOut("slow");
    return false;
  });
  $(".main-content").click(function () {
    $("#notifications").fadeOut("fast", "linear");
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images")
    .unbind("click")
    .on("click", function () {
      let href = $(this).attr("href");
      let modalImagesId = href.replace("#", "");

      let originDataImage = $(`#${modalImagesId}`)
        .find("div.modal-body")
        .html();

      let countRows = Math.ceil(
        $(`#${modalImagesId}`).find("div.all-images>img").length / layoutNumber
      );
      let layoutStr = new Array(countRows).fill(layoutNumber).join("");
      $(`#${modalImagesId}`)
        .find("div.all-images")
        .photosetGrid({
          highresLinks: true,
          rel: "withhearts-gallery",
          gutter: "2px",
          layout: layoutStr,
          onComplete: function () {
            $(`#${modalImagesId}`).find(".all-images").css({
              visibility: "visible",
            });
            $(`#${modalImagesId}`).find(".all-images a").colorbox({
              photo: true,
              scalePhotos: true,
              maxHeight: "90%",
              maxWidth: "90%",
            });
          },
        });

      // Bắt sự kiện đóng modal
      $(`#${modalImagesId}`).on("hidden.bs.modal", function () {
        $(this).find("div.modal-body").html(originDataImage);
      });
    });
}

function flashMasterNotify() {
  let notify = $(".master-success-message.alert.alert-success").text();
  if (notify.length) {
    alertify.notify(notify, "success", 5);
  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if ($(this).val() === "user-chat") $(".create-group-chat").hide();
    else $(".create-group-chat").show();
  });
}

function changeScreenChat() {
  $(".room-chat")
    .unbind("click")
    .on("click", function () {
      let divId = $(this).find("li").data("chat");

      $(".person").removeClass("active");
      $(`.person[data-chat=${divId}]`).addClass("active");

      $(this).find("li").addClass("active");
      $(this).tab("show");

      // Cấu hình thanh cuộn box rightSide mỗi khi mà mình click xuống vào một cuộc trò chuyện cụ thể
      nineScrollRight(divId);

      // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
      enableEmojioneArea(divId);

      // Bật lắng nghe DOM cho việc chat tin nhắn là hình ảnh
      imageChat(divId);

      // Bật lắng nghe DOM cho việc chat tin nhắn là tệp đính kèm
      attachmentChat(divId);

      // Bật lắng nghe DOM cho việc gọi video
      videoChat(divId);
    });
}

function convertEmoji() {
  $(".convert-emoji").each(function () {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}

function bufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function notYetConversation() {
  if (!$("ul.people").find("li").length) {
    Swal.fire({
      title: "Bạn chưa có bạn bè nào. Hãy tìm kiếm bạn quanh đây!",
      type: "info",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Xác nhận",
      title: "Bạn chưa có bạn bè nào. Hãy tìm kiếm bạn quanh đây!",
    }).then(result => {
      $("#contactsModal").modal("show");
    });
  }
}

function userTalk() {
  $(".user-talk")
    .unbind("click")
    .on("click", function () {
      let dataChat = $(this).data("uid");
      $("ul.people").find(`a[href="#uid_${dataChat}"`).click();
      $(this).closes("div.modal").modal("hide");
    });
}

function zoomImageInChat() {
  $(".show-image-chat")
    .unbind("click")
    .on("click", function () {
      $("#modalImageChat").show();
      $("#chatImage").attr("src", this.src);
    });

  $("#modalImageChat").on("click", e => {
    $("#modalImageChat").hide();
  });
  $("#chatImage").on("click", function (e) {
    e.stopPropagation();
  });
}

function showMembersInfo() {
  $(".number-members")
    .unbind("click")
    .on("click", function () {
      console.log($(this).data("chat"));
    });
}

$(document).ready(function () {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Flash message ở màn hình master
  flashMasterNotify();

  // Thay đổi kiểu trò chuyện
  changeTypeChat();

  // Thay đổi màn hình chat
  changeScreenChat();

  // convert các unicode thành hình ảnh cảm xúc
  convertEmoji();
  // click vào phần tử đâu tiên của cuộc trò chuyện khi load
  if ($("ul.people").find("a").length) {
    $("ul.people").find("a")[0].click();
  }

  // Hiển thị thông báo, chức năng video trò chuyện nhóm chưa có
  $(`#video-chat-group`).bind("click", function () {
    alertify.notify(
      "Không khả dụng tính năng này với nhóm trò truyện. Vui lòng thử lại với nhóm trò chuyện cá nhân",
      "error",
      6
    );
  });

  // Hiển thị thông báo, khi chưa có bạn bè nào
  notYetConversation();

  // Click vào nút trò chuyện, hiện thị ra phần chat
  userTalk();

  // Phóng to ảnh khi click vào hình ảnh trong chat
  zoomImageInChat();
});
