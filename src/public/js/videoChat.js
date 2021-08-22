function videoChat(divId) {
  $(`#video-chat-${divId}`)
    .unbind('click')
    .on('click', function () {
      let targetId = $(this).data('chat')
      let callerName = $(`#navbar-username`).text()

      let dataToEmit = {
        listenerId: targetId,
        callerName,
      }
      // Step 01: of caller
      socket.emit('caller-check-listener-online-or-not', dataToEmit)
    })
}

$(document).ready(() => {
  // Step 02: of caller
  socket.on('server-send-listener-is-offline', function () {
    alertify.notify('Người dùng hiện tại không trực tuyến', 'error', 8)
  })

  // Step 03: of listener
  let getPeerId = ''
  const peer = new Peer()
  peer.on('open', peerId => (getPeerId = peerId))
  socket.on('server-request-peer-id-of-listener', function (response) {
    let listenerName = $(`#navbar-username`).text()
    let dataToEmit = {
      listenerId: response.listenerId,
      callerId: response.callerId,
      callerName: response.callerName,
      listenerPeerId: getPeerId,
      listenerName: listenerName,
    }

    // Step 04: of listener
    socket.emit('listener-emit-peer-id-to-server', dataToEmit)
  })

  // Step 05: of caller
  socket.on('server-send-peer-id-of-listener-to-caller', response => {
    const { listenerId, callerId, callerName, listenerPeerId, listenerName } =
      response

    let dataToEmit = {
      listenerId,
      callerId,
      callerName,
      listenerPeerId,
      listenerName,
    }

    // Step 06: of caller
    socket.emit('caller-request-call-to-server', dataToEmit)
    let timerInterval
    Swal.fire({
      title: `Đang gọi cho &nbsp;<span style="color: #2ecc71;">${listenerName}</span> &nbsp;<i class="fa fa-volume-control-phone"></i>`,
      html: `
      Thời gian: <strong style="color: #t43f3a;"></strong> giây <br/><br/>
      <button id="btn-cancel-call" class="btn btn-danger">
        Hủy cuộc gọi
      </button>
      `,
      backdrop: 'rgba(85,85,85,0.4)',
      width: '52rem',
      allowOutsideClick: false,
      timer: 30000, //30 second
      onBeforeOpen: () => {
        $(`#btn-cancel-call`)
          .unbind('click')
          .on('click', () => {
            Swal.close()
            clearInterval(timerInterval)

            // Step 07: of caller
            socket.emit('caller-cancel-request-call-to-server', dataToEmit)
          })
        Swal.showLoading()
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(
            Swal.getTimerLeft() / 1000
          )
        }, 1000)
      },
      onOpen: () => {
        // Step 12: of caller
        socket.on('server-send-reject-call-to-caller', response => {
          Swal.close()
          clearInterval(timerInterval)

          Swal.fire({
            type: 'info',
            title: `<span style="color: #2ecc71;">${response.listenerName}</span> &nbsp; Hiện tại không thể nghe máy`,
            backdrop: 'rgba(85,85,85,0.4)',
            width: '52rem',
            allowOutsideClick: false,
            confirmButtonColor: '#2ecc71',
            confirmButtonText: 'Xác nhận',
          })
        })
        // Step 13: of caller
        socket.on('server-send-accept-call-to-caller', response => {
          Swal.close()
          clearInterval(timerInterval)

          console.log('Caller okkkk..........')
        })
      },
      onClose: () => {
        clearInterval(timerInterval)
      },
    }).then(result => {
      return false
    })
  })

  // Step 08: of listener
  socket.on('server-send-request-call-to-listener', response => {
    const { listenerId, callerId, callerName, listenerPeerId, listenerName } =
      response

    let dataToEmit = {
      listenerId,
      callerId,
      callerName,
      listenerPeerId,
      listenerName,
    }

    let timerInterval
    Swal.fire({
      title: `
      <span style="color: #2ecc71;">${callerName}</span> &nbsp; muốn trò chuyện với bạn 
      <i class="fa fa-volume-control-phone"></i>
      `,
      html: `
      Thời gian: <strong style="color: #t43f3a;"></strong> giây <br/><br/>
      <button id="btn-reject-call" class="btn btn-danger">
        Từ chối.
      </button>
      <button id="btn-accept-call" class="btn btn-success">
        Đồng ý.
      </button>
      `,
      backdrop: 'rgba(85,85,85,0.4)',
      width: '52rem',
      allowOutsideClick: false,
      timer: 30000, //30 second
      onBeforeOpen: () => {
        $(`#btn-reject-call`)
          .unbind('click')
          .on('click', () => {
            Swal.close()
            clearInterval(timerInterval)

            // Step 10: of listener
            socket.emit('listener-reject-request-call-to-server', dataToEmit)
          })

        $(`#btn-accept-call`)
          .unbind('click')
          .on('click', () => {
            Swal.close()
            clearInterval(timerInterval)

            // Step 11: of listener
            socket.emit('listener-accept-request-call-to-server', dataToEmit)
          })

        Swal.showLoading()
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(
            Swal.getTimerLeft() / 1000
          )
        }, 1000)
      },
      onOpen: () => {
        // Step 09: of listener
        socket.on('server-send-cancel-request-call-to-listener', response => {
          Swal.close()
          clearInterval(timerInterval)
        })

        // Step 14: of listener
        socket.on('server-send-accept-call-to-listener', response => {
          Swal.close()
          clearInterval(timerInterval)

          console.log('Caller okkkk..........')
        })
      },
      onClose: () => {
        clearInterval(timerInterval)
      },
    }).then(result => {
      return false
    })
  })
})
