import type { TranslationType } from "./en";
// Translated by GPT-4o
export const translation = {
  locale: "简体中文",
  localeCode: "zh-CN",
  common: {
    submit: "提交",
    cancel: "取消",
    submitSuccess: "提交成功",
    done: "完成",
    confirm: "确认",
    goBack: "返回",
    create: "新增",
    update: "更新",
    emailAddress: "电子邮箱",
  },
  home: {
    title: "课堂助教系统",
    tronclass: "Tronclass",
    classroom: "前往教室",
    about: "关于本站",
  },
  header: {
    homeTooltip: "回首页",
    nav: {
      classroom: "教室",
      management: "助教管理",
      about: "关于本站",
      logout: "登出",
      darkMode: "深色模式",
      lightMode: "浅色模式",
      changeLanguage: "切换语言",
    },
  },
  classroom: {
    actions: {
      enqueue: "呼叫助教",
      dequeue: "取消呼叫",
      commonQuestions: "常见问题",
      homework: "本周作业",
      reset: "重设座位",
      complete: "完成当前",
      manual: "手动 Demo",
      completeFull: "完成当前 Demo",
      manualFull: "手动 Demo",
    },
    studentNumberRaw: "学号",
    studentNumber: "学号：",
    points: "题数",
    rotation: {
      rotateSeat: "旋转座位显示",
      turnClockwise: "顺时针旋转",
      turnCounterClockwise: "逆时针旋转",
    },
    info: {
      numberInQueue: "当前排位",
      waitingNumber: "当前等待人数",
    },
    guide: {
      chooseSeatTitle: "选择座位",
      chooseSeatDescription: "点击教室平面图中的座位设置你的位子。",
      quickSetting: {
        title: "快速设置",
        mainQuestion: "面对电脑时，老师位于我的...？",
        left: "左边",
        right: "右边",
      },
    },
    classEnded: {
      title: "课程已结束",
      awaiting: "Demo 仍在等待队列中，完成 Demo 前请勿关闭此页面。",
      reminder: "请带走作业并在离开教室前关闭电脑。",
      leaveQueue: "离开队列",
    },
  },
  entity: {
    door: "门",
    seat: {
      moveHere: "移动到这里",
      moveHereSideway: "移动到这里 (横向座位)",
      selected: "当前座位",
      teacher: "老师",
      whiteboard: "白板",
      window: "窗户",
    },
  },
  management: {
    loginAs: "当前登录：{{email}}",
    class: {
      title: "课程相关",
      editClass: "编辑课程",
      created: "课程创建成功！",
      confirmDelete: "确认删除课程？此操作无法撤销！",
      deleted: "课程已删除。",
      date: "日期",
      startAt: "开始时间",
      endAt: "结束时间",
      totalPoints: "题数",
      homeworkLink: "作业链接",
      classTime: "课程时间",
      startAtFull: "{{date}} ({{time}} 开始)",
      gradeSummary: "成绩统计",
      selectClass: "选择课程",
      selectClassTime: "选择课程时间",
      points: "题数",
      seatRecords: "座位记录",
    },
    ta: {
      title: "助教设置",
      errorOccurred: "发生错误，请参考浏览器 Console。",
      newPassword: "新密码",
      updatePassword: "更新密码",
      passwordUpdated: "密码更新成功，请重新登录。",
      createAccount: "创建账号",
      accountCreated: "成功创建新助教账号，请重新登录。",
      newTAAccount: "新增助教",
      defaultPassword: {
        "1": "*新账号的默认密码为 ",
        "2": "，请登录后自行更新密码。",
      },
    },
  },
  login: {
    loginFailed: "登录失败",
    loginFailedDesc: "邮箱或密码错误",
    password: "密码",
    login: "登录",
    taLogin: "助教登录",
  },
  about: {
    title: "关于本站",
    description: "课堂助教系统，辅助课堂 Demo。使用 React 开发 ❤️",
  },
  export: {
    up: "上面",
    down: "下面",
    left: "左边",
    right: "右边",
    download: "下载",
  },
} satisfies TranslationType;