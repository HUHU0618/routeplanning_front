import { IConfig, IPlugin } from "umi-types";
import defaultSettings from "./defaultSettings"; // https://umijs.org/config/

import slash from "slash2";
import themePluginConfig from "./themePluginConfig";
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview =
  ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === "site";
const plugins: IPlugin[] = [
  [
    "umi-plugin-react",
    {
      antd: true,
      dva: {
        hmr: true
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: "zh-CN",
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true
      },
      dynamicImport: {
        loadingComponent: "./components/PageLoading/index",
        webpackChunkName: true,
        level: 3
      },
      pwa: pwa
        ? {
            workboxPluginMode: "InjectManifest",
            workboxOptions: {
              importWorkboxFrom: "local"
            }
          }
        : false // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    }
  ],
  [
    "umi-plugin-pro-block",
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true
    }
  ]
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    "umi-plugin-ga",
    {
      code: "UA-72788897-6"
    }
  ]);
  plugins.push(["umi-plugin-antd-theme", themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  // routes: [
  //   {
  //path: '/',
  // component: '../layouts/SecurityLayout',
  routes: [
    {
      path: "/",
      component: "../layouts/BasicLayout",
      routes: [
        // 配送点管理
        {
          name: "配送点管理",
          icon: "money-collect",
          path: "/task",
          routes: [
            // {
            //   name: '配送点配送规划',
            //   icon: 'money-collect',
            //   path: '/task/add',
            //   component: './Task',
            // },
            {
              name: "配送点信息查看",
              icon: "book",
              path: "/task/record",
              component: "./TaskRecord"
            }
          ]
        },
        // 配送车辆管理
        {
          name: "配送车辆管理",
          icon: "book",
          path: "/vehicle",
          routes: [
            // {
            //   name: '新增配送车辆',
            //   icon: 'book',
            //   path: '/vehicle/add',
            //   component: './vehicle',
            // },
            {
              name: "车辆信息查看",
              icon: "book",
              path: "/vehicle/record",
              component: "./VehicleRecord"
            }
          ]
        },
        // 车辆类型管理
        {
          name: "车辆类型管理",
          icon: "book",
          path: "/vehicle_type",
          routes: [
            // {
            //   name: '新增车辆类型',
            //   icon: 'book',
            //   path: '/vehicleType/add',
            //   component: './vehicleType',
            // },
            {
              name: "车辆类型信息查看",
              icon: "book",
              path: "/vehicle_type/record",
              component: "./TypeRecord"
            }
          ]
        },
        {
          component: "./404"
        }
      ] //routes//////
    }, /////path
    {
      component: "./404"
    }
  ], //////routes
  //   },
  //   {
  //     component: './404',
  //   },
  // ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || "" // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes("node_modules") ||
        context.resourcePath.includes("ant.design.pro.less") ||
        context.resourcePath.includes("global.less")
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace(".less", "");
        const arr = slash(antdProPath)
          .split("/")
          .map((a: string) => a.replace(/([A-Z])/g, "-$1"))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join("-")}-${localName}`.replace(/--/g, "-");
      }

      return localName;
    }
  },
  manifest: {
    // basePath: '/api',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    "/api/": {
      target: "http://localhost:5000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      }
    }
  }
} as IConfig;
