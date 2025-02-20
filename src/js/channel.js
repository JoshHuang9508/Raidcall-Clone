class Channel {
  constructor() {
    this.userOperateMenu = document.querySelector('.server-user-operate-context-menu');
    this.users = document.querySelectorAll('.server-channel-user-info .vip-icon');
    this.userInfoCard = document.querySelector('.server-user-info-card');

    this.settingsButton = document.querySelector('.server-settings');
    this.settingsMenu = document.querySelector('.server-settings-context-menu');

    this.memberGroupChat = document.querySelector('li[data-key="30314"]');

    this.serverPictureWrapper = document.querySelector('.server-picture-wrapper');

    this.isHoveringUser = false;
    this.isHoveringCard = false;

    this.initEvents();
  }

  // 初始化事件
  initEvents() {
    this.users.forEach((user) => {
      user.addEventListener('mouseenter', (event) => this.showUserInfo(event));
      user.addEventListener('mouseleave', () => this.hideUserInfoWithDelay());
    });

    this.userInfoCard.addEventListener('mouseenter', () => {
      this.isHoveringCard = true;
      clearTimeout(this.hideTimeout);
    });

    this.userInfoCard.addEventListener('mouseleave', () => {
      this.isHoveringCard = false;
      this.hideUserInfo();
    });

    this.memberGroupChat.addEventListener('click', (event) => {
      event.stopPropagation();
      this.settingsMenu.style.display = 'none';
      ipcRenderer.send('open-pop-window', { code: 1005, titleCode: 30051, textCode: null, icon: 'warning' }, 550, 700, 'member_group_chat', false);
    });

    this.serverPictureWrapper.addEventListener('click', () => {
      ipcRenderer.send('open-pop-window', { code: null, titleCode: null, textCode: null, icon: 'warning' }, 500, 600, 'server_setting', false);
    });

    document.addEventListener('click', (event) => {
      console.log(this.settingsMenu);
      if (this.userOperateMenu && !this.userOperateMenu.contains(event.target)) {
        this.userOperateMenu.style.display = 'none';
      }

      if (this.settingsMenu && !this.settingsMenu.contains(event.target) && event.target !== this.settingsButton) {
        this.settingsMenu.style.display = 'none';
      }
    });
  }

  // 顯示右鍵菜單
  showContextMenu(event) {
    event.preventDefault();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const menuWidth = this.userOperateMenu.offsetWidth;
    const menuHeight = this.userOperateMenu.offsetHeight;
    let posX = event.pageX;
    if (posX + menuWidth > windowWidth) {
      posX = windowWidth - menuWidth - 10;
    }
    let posY = event.pageY;
    if (posY + menuHeight > windowHeight) {
      posY = windowHeight - menuHeight - 10;
    }
    this.userOperateMenu.style.display = 'block';
    this.userOperateMenu.style.left = `${posX}px`;
    this.userOperateMenu.style.top = `${posY}px`;
  }

  // 顯示設定菜單
  openSettingMenu() {
    this.settingsMenu.style.display = 'block';
  }

  // 顯示資訊卡
  showUserInfo(event) {
    this.isHoveringUser = true;
    clearTimeout(this.hideTimeout);
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    const offsetX = 3;
    const offsetY = 3;
    let posX = mouseX + offsetX;
    let posY = mouseY + offsetY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const cardWidth = this.userInfoCard.offsetWidth;
    const cardHeight = this.userInfoCard.offsetHeight;
    if (posX + cardWidth > windowWidth) {
      posX = mouseX - cardWidth - offsetX;
    }
    if (posY + cardHeight > windowHeight) {
      posY = windowHeight - cardHeight - offsetY;
    }
    this.userInfoCard.style.left = `${posX}px`;
    this.userInfoCard.style.top = `${posY}px`;
    this.userInfoCard.style.display = 'block';
  }

  // 滑鼠離開使用者時設定延遲隱藏
  hideUserInfoWithDelay() {
    this.isHoveringUser = false;
    this.hideTimeout = setTimeout(() => {
      if (!this.isHoveringUser && !this.isHoveringCard) {
        this.userInfoCard.style.display = 'none';
      }
    }, 200);
  }

  // **滑鼠離開資訊卡時隱藏
  hideUserInfo() {
    this.isHoveringCard = false;
    if (!this.isHoveringUser) {
      this.userInfoCard.style.display = 'none';
    }
  }
}

new Channel();
