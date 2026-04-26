import { importShared } from './__federation_fn_import-054b33c3.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-c4c0bc37.js';

const Config_vue_vue_type_style_index_0_scoped_1ddc2c43_lang = '';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,createElementVNode:_createElementVNode,withCtx:_withCtx,createTextVNode:_createTextVNode,vModelCheckbox:_vModelCheckbox,withDirectives:_withDirectives,openBlock:_openBlock,createElementBlock:_createElementBlock,toDisplayString:_toDisplayString} = await importShared('vue');


const _hoisted_1 = { class: "gy-config" };
const _hoisted_2 = { class: "gy-topbar" };
const _hoisted_3 = { class: "gy-topbar__left" };
const _hoisted_4 = { class: "gy-topbar__icon" };
const _hoisted_5 = { class: "gy-topbar__right" };
const _hoisted_6 = { class: "gy-config-col" };
const _hoisted_7 = { class: "gy-card" };
const _hoisted_8 = { class: "gy-card__header" };
const _hoisted_9 = { class: "gy-card__title d-flex align-center" };
const _hoisted_10 = { class: "gy-switch-row" };
const _hoisted_11 = { class: "gy-switch-item" };
const _hoisted_12 = { class: "gy-row__text" };
const _hoisted_13 = {
  class: "switch",
  style: {"--switch-checked-bg":"#a78bfa"}
};
const _hoisted_14 = { class: "slider" };
const _hoisted_15 = { class: "circle" };
const _hoisted_16 = {
  class: "cross",
  "xml:space": "preserve",
  style: {"enable-background":"new 0 0 512 512"},
  viewBox: "0 0 365.696 365.696",
  y: "0",
  x: "0",
  height: "6",
  width: "6",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
};
const _hoisted_17 = {
  class: "checkmark",
  "xml:space": "preserve",
  style: {"enable-background":"new 0 0 512 512"},
  viewBox: "0 0 24 24",
  y: "0",
  x: "0",
  height: "10",
  width: "10",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
};
const _hoisted_18 = { class: "gy-switch-item" };
const _hoisted_19 = { class: "gy-row__text" };
const _hoisted_20 = {
  class: "switch",
  style: {"--switch-checked-bg":"#ef4444"}
};
const _hoisted_21 = { class: "slider" };
const _hoisted_22 = { class: "circle" };
const _hoisted_23 = {
  class: "cross",
  "xml:space": "preserve",
  style: {"enable-background":"new 0 0 512 512"},
  viewBox: "0 0 365.696 365.696",
  y: "0",
  x: "0",
  height: "6",
  width: "6",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
};
const _hoisted_24 = {
  class: "checkmark",
  "xml:space": "preserve",
  style: {"enable-background":"new 0 0 512 512"},
  viewBox: "0 0 24 24",
  y: "0",
  x: "0",
  height: "10",
  width: "10",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
};
const _hoisted_25 = { class: "gy-card" };
const _hoisted_26 = { class: "gy-card__header" };
const _hoisted_27 = { class: "gy-card__title d-flex align-center" };
const _hoisted_28 = { class: "gy-card" };
const _hoisted_29 = { class: "gy-card__header" };
const _hoisted_30 = { class: "gy-card__title d-flex align-center" };
const _hoisted_31 = { class: "gy-card" };
const _hoisted_32 = { class: "gy-card__header" };
const _hoisted_33 = { class: "gy-card__title d-flex align-center" };
const _hoisted_34 = { class: "gy-desc-content" };
const _hoisted_35 = { class: "gy-desc-item" };
const _hoisted_36 = { class: "gy-desc-item" };
const _hoisted_37 = { class: "gy-desc-item" };
const _hoisted_38 = { class: "gy-desc-item" };

const {onMounted,reactive,ref} = await importShared('vue');



const _sfc_main = {
  __name: 'Config',
  props: {
  initialConfig: { type: Object, default: () => ({}) },
  api: { type: Object, default: () => ({}) },
},
  emits: ['close', 'switch'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;

const config = reactive({
  enabled: false,
  permanently_delete: false,
  access_token: '',
  refresh_token: '',
  client_id: '',
  device_id: '',
  poll_interval: 5,
  page_size: 100,
  order_by: 3,
  sort_type: 1,
  logged_in: false,
  ...props.initialConfig,
});

const loading = ref(false);
const saving = ref(false);
const showAccessToken = ref(false);
const showRefreshToken = ref(false);
const message = reactive({ show: false, type: 'info', text: '' });

const sortTypeOptions = ref([
  { title: '升序', value: 1 },
  { title: '降序', value: 0 },
]);

function pluginUrl(path) {
  return `/api/v1/plugin/ShukGuangYaDisk${path}`
}

async function request(path, options = {}) {
  const apiPath = `plugin/ShukGuangYaDisk${path}`;
  if (options.method === 'POST') {
    if (props.api?.post) {
      return props.api.post(apiPath, options.body ? JSON.parse(options.body) : {}, options)
    }
  } else if (props.api?.get) {
    return props.api.get(apiPath, options)
  }

  const response = await fetch(pluginUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  return response.json()
}

function applyConfig(data = {}) {
  config.enabled = Boolean(data.enabled);
  config.permanently_delete = Boolean(data.permanently_delete);
  config.access_token = data.access_token || '';
  config.refresh_token = data.refresh_token || '';
  config.client_id = data.client_id || '';
  config.device_id = data.device_id || '';
  config.poll_interval = Number(data.poll_interval || 5);
  config.page_size = Number(data.page_size || 100);
  config.order_by = Number(data.order_by || 3);
  config.sort_type = Number(data.sort_type || 1);
  config.logged_in = Boolean(data.logged_in);
}

function setMessage(type, text) {
  message.type = type;
  message.text = text;
  message.show = true;
}

async function loadConfig() {
  loading.value = true;
  try {
    const data = await request('/config');
    applyConfig(data);
  } catch (error) {
    setMessage('error', `加载配置失败：${error}`);
  } finally {
    loading.value = false;
  }
}

async function saveConfig() {
  saving.value = true;
  try {
    const result = await request('/config', {
      method: 'POST',
      body: JSON.stringify({ ...config }),
    });
    if (!result.success) {
      throw new Error(result.message || '保存失败')
    }
    applyConfig(result.data || {});
    setMessage('success', result.message || '配置保存成功');
  } catch (error) {
    setMessage('error', `保存配置失败：${error.message || error}`);
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadConfig();
});

return (_ctx, _cache) => {
  const _component_v_icon = _resolveComponent("v-icon");
  const _component_v_btn = _resolveComponent("v-btn");
  const _component_v_btn_group = _resolveComponent("v-btn-group");
  const _component_v_text_field = _resolveComponent("v-text-field");
  const _component_v_col = _resolveComponent("v-col");
  const _component_v_row = _resolveComponent("v-row");
  const _component_v_select = _resolveComponent("v-select");
  const _component_v_snackbar = _resolveComponent("v-snackbar");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("div", _hoisted_3, [
        _createElementVNode("div", _hoisted_4, [
          _createVNode(_component_v_icon, {
            icon: "mdi-cog-outline",
            size: "24"
          })
        ]),
        _cache[15] || (_cache[15] = _createElementVNode("div", null, [
          _createElementVNode("div", { class: "gy-topbar__title" }, "光鸭云盘 · 配置"),
          _createElementVNode("div", { class: "gy-topbar__sub" }, "插件参数配置")
        ], -1))
      ]),
      _createElementVNode("div", _hoisted_5, [
        _createVNode(_component_v_btn_group, {
          variant: "tonal",
          density: "compact",
          class: "elevation-0"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_v_btn, {
              color: "primary",
              onClick: _cache[0] || (_cache[0] = $event => (emit('switch'))),
              size: "small",
              "min-width": "40",
              class: "px-0 px-sm-3"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_icon, {
                  icon: "mdi-view-dashboard",
                  size: "18",
                  class: "mr-sm-1"
                }),
                _cache[16] || (_cache[16] = _createElementVNode("span", { class: "btn-text d-none d-sm-inline" }, "状态页", -1))
              ]),
              _: 1
            }),
            _createVNode(_component_v_btn, {
              color: "primary",
              loading: saving.value,
              onClick: saveConfig,
              size: "small",
              "min-width": "40",
              class: "px-0 px-sm-3"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_icon, {
                  icon: "mdi-content-save",
                  size: "18",
                  class: "mr-sm-1"
                }),
                _cache[17] || (_cache[17] = _createElementVNode("span", { class: "btn-text d-none d-sm-inline" }, "保存", -1))
              ]),
              _: 1
            }, 8, ["loading"]),
            _createVNode(_component_v_btn, {
              color: "primary",
              onClick: _cache[1] || (_cache[1] = $event => (emit('close'))),
              size: "small",
              "min-width": "40",
              class: "px-0 px-sm-3"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_icon, {
                  icon: "mdi-close",
                  size: "18"
                }),
                _cache[18] || (_cache[18] = _createElementVNode("span", { class: "btn-text d-none d-sm-inline" }, "关闭", -1))
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ])
    ]),
    _createElementVNode("div", _hoisted_6, [
      _createElementVNode("div", _hoisted_7, [
        _createElementVNode("div", _hoisted_8, [
          _createElementVNode("span", _hoisted_9, [
            _createVNode(_component_v_icon, {
              icon: "mdi-tune-vertical",
              size: "18",
              color: "#8b5cf6",
              class: "mr-1"
            }),
            _cache[19] || (_cache[19] = _createTextVNode(" 基础配置 ", -1))
          ])
        ]),
        _createElementVNode("div", _hoisted_10, [
          _createElementVNode("div", _hoisted_11, [
            _createElementVNode("span", _hoisted_12, [
              _createVNode(_component_v_icon, {
                icon: "mdi-power-plug",
                size: "20",
                color: config.enabled ? '#a78bfa' : 'grey',
                class: "mr-2"
              }, null, 8, ["color"]),
              _cache[20] || (_cache[20] = _createTextVNode(" 启用插件 ", -1))
            ]),
            _createElementVNode("label", _hoisted_13, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.enabled) = $event)),
                type: "checkbox"
              }, null, 512), [
                [_vModelCheckbox, config.enabled]
              ]),
              _createElementVNode("div", _hoisted_14, [
                _createElementVNode("div", _hoisted_15, [
                  (_openBlock(), _createElementBlock("svg", _hoisted_16, [...(_cache[21] || (_cache[21] = [
                    _createElementVNode("g", null, [
                      _createElementVNode("path", {
                        "data-original": "#000000",
                        fill: "currentColor",
                        d: "M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
                      })
                    ], -1)
                  ]))])),
                  (_openBlock(), _createElementBlock("svg", _hoisted_17, [...(_cache[22] || (_cache[22] = [
                    _createElementVNode("g", { transform: "translate(-0.4, 0.2)" }, [
                      _createElementVNode("path", {
                        class: "",
                        "data-original": "#000000",
                        fill: "currentColor",
                        d: "M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                      })
                    ], -1)
                  ]))]))
                ])
              ])
            ])
          ]),
          _createElementVNode("div", _hoisted_18, [
            _createElementVNode("span", _hoisted_19, [
              _createVNode(_component_v_icon, {
                icon: "mdi-delete-alert-outline",
                size: "20",
                color: config.permanently_delete ? '#ef4444' : 'grey',
                class: "mr-2"
              }, null, 8, ["color"]),
              _cache[23] || (_cache[23] = _createTextVNode(" 彻底删除 ", -1))
            ]),
            _createElementVNode("label", _hoisted_20, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.permanently_delete) = $event)),
                type: "checkbox"
              }, null, 512), [
                [_vModelCheckbox, config.permanently_delete]
              ]),
              _createElementVNode("div", _hoisted_21, [
                _createElementVNode("div", _hoisted_22, [
                  (_openBlock(), _createElementBlock("svg", _hoisted_23, [...(_cache[24] || (_cache[24] = [
                    _createElementVNode("g", null, [
                      _createElementVNode("path", {
                        "data-original": "#000000",
                        fill: "currentColor",
                        d: "M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
                      })
                    ], -1)
                  ]))])),
                  (_openBlock(), _createElementBlock("svg", _hoisted_24, [...(_cache[25] || (_cache[25] = [
                    _createElementVNode("g", { transform: "translate(-0.4, 0.2)" }, [
                      _createElementVNode("path", {
                        class: "",
                        "data-original": "#000000",
                        fill: "currentColor",
                        d: "M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                      })
                    ], -1)
                  ]))]))
                ])
              ])
            ])
          ])
        ]),
        _createVNode(_component_v_row, { class: "mt-2 mb-0" }, {
          default: _withCtx(() => [
            _createVNode(_component_v_col, {
              cols: "12",
              sm: "6",
              class: "py-1"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_text_field, {
                  modelValue: config.client_id,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.client_id) = $event)),
                  label: "Client ID",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "gy-input",
                  placeholder: "留空使用默认值"
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            _createVNode(_component_v_col, {
              cols: "12",
              sm: "6",
              class: "py-1"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_text_field, {
                  modelValue: config.device_id,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.device_id) = $event)),
                  label: "设备 ID",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "gy-input",
                  placeholder: "自动生成"
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _createElementVNode("div", _hoisted_25, [
        _createElementVNode("div", _hoisted_26, [
          _createElementVNode("span", _hoisted_27, [
            _createVNode(_component_v_icon, {
              icon: "mdi-tune-variant",
              size: "18",
              color: "#0ea5e9",
              class: "mr-1"
            }),
            _cache[26] || (_cache[26] = _createTextVNode(" 查询参数 ", -1))
          ])
        ]),
        _createVNode(_component_v_row, { class: "mt-1 mb-0" }, {
          default: _withCtx(() => [
            _createVNode(_component_v_col, {
              cols: "6",
              sm: "6",
              class: "py-1"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_text_field, {
                  modelValue: config.poll_interval,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.poll_interval) = $event)),
                  modelModifiers: { number: true },
                  label: "轮询间隔(秒)",
                  type: "number",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "gy-input"
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            _createVNode(_component_v_col, {
              cols: "6",
              sm: "6",
              class: "py-1"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_text_field, {
                  modelValue: config.page_size,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.page_size) = $event)),
                  modelModifiers: { number: true },
                  label: "分页大小",
                  type: "number",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "gy-input"
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            _createVNode(_component_v_col, {
              cols: "6",
              sm: "6",
              class: "py-1"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_text_field, {
                  modelValue: config.order_by,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.order_by) = $event)),
                  modelModifiers: { number: true },
                  label: "排序字段",
                  type: "number",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "gy-input"
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            _createVNode(_component_v_col, {
              cols: "6",
              sm: "6",
              class: "py-1"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_select, {
                  modelValue: config.sort_type,
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.sort_type) = $event)),
                  modelModifiers: { number: true },
                  items: sortTypeOptions.value,
                  "item-title": "title",
                  "item-value": "value",
                  label: "排序方向",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "gy-input"
                }, null, 8, ["modelValue", "items"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _createElementVNode("div", _hoisted_28, [
        _createElementVNode("div", _hoisted_29, [
          _createElementVNode("span", _hoisted_30, [
            _createVNode(_component_v_icon, {
              icon: "mdi-key-outline",
              size: "18",
              color: "#f59e0b",
              class: "mr-1"
            }),
            _cache[27] || (_cache[27] = _createTextVNode(" 令牌信息 ", -1))
          ])
        ]),
        _createVNode(_component_v_text_field, {
          modelValue: config.access_token,
          "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config.access_token) = $event)),
          label: "Access Token",
          type: showAccessToken.value ? 'text' : 'password',
          "append-inner-icon": showAccessToken.value ? 'mdi-eye-off-outline' : 'mdi-eye-outline',
          variant: "outlined",
          density: "compact",
          class: "gy-input mb-3",
          "hide-details": "",
          autocomplete: "off",
          "onClick:appendInner": _cache[11] || (_cache[11] = $event => (showAccessToken.value = !showAccessToken.value))
        }, null, 8, ["modelValue", "type", "append-inner-icon"]),
        _createVNode(_component_v_text_field, {
          modelValue: config.refresh_token,
          "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((config.refresh_token) = $event)),
          label: "Refresh Token",
          type: showRefreshToken.value ? 'text' : 'password',
          "append-inner-icon": showRefreshToken.value ? 'mdi-eye-off-outline' : 'mdi-eye-outline',
          variant: "outlined",
          density: "compact",
          class: "gy-input",
          "hide-details": "",
          autocomplete: "off",
          "onClick:appendInner": _cache[13] || (_cache[13] = $event => (showRefreshToken.value = !showRefreshToken.value))
        }, null, 8, ["modelValue", "type", "append-inner-icon"])
      ])
    ]),
    _createElementVNode("div", _hoisted_31, [
      _createElementVNode("div", _hoisted_32, [
        _createElementVNode("span", _hoisted_33, [
          _createVNode(_component_v_icon, {
            icon: "mdi-book-open-page-variant-outline",
            size: "18",
            color: "#6366f1",
            class: "mr-1"
          }),
          _cache[28] || (_cache[28] = _createTextVNode(" 使用说明 ", -1))
        ])
      ]),
      _createElementVNode("div", _hoisted_34, [
        _createElementVNode("div", _hoisted_35, [
          _createVNode(_component_v_icon, {
            icon: "mdi-numeric-1-circle-outline",
            size: "16",
            color: "primary",
            class: "mr-2"
          }),
          _cache[29] || (_cache[29] = _createElementVNode("span", null, [
            _createElementVNode("strong", null, "扫码登录："),
            _createTextVNode("请在状态页使用二维码扫码登录光鸭云盘 App 完成授权")
          ], -1))
        ]),
        _createElementVNode("div", _hoisted_36, [
          _createVNode(_component_v_icon, {
            icon: "mdi-numeric-2-circle-outline",
            size: "16",
            color: "primary",
            class: "mr-2"
          }),
          _cache[30] || (_cache[30] = _createElementVNode("span", null, [
            _createElementVNode("strong", null, "令牌管理："),
            _createTextVNode("登录成功后令牌会自动保存，刷新页面后无需重新登录")
          ], -1))
        ]),
        _createElementVNode("div", _hoisted_37, [
          _createVNode(_component_v_icon, {
            icon: "mdi-numeric-3-circle-outline",
            size: "16",
            color: "primary",
            class: "mr-2"
          }),
          _cache[31] || (_cache[31] = _createElementVNode("span", null, [
            _createElementVNode("strong", null, "参数说明："),
            _createTextVNode("轮询间隔建议 5-10 秒，分页大小建议 50-200，排序字段和方向可根据需要调整")
          ], -1))
        ]),
        _createElementVNode("div", _hoisted_38, [
          _createVNode(_component_v_icon, {
            icon: "mdi-numeric-4-circle-outline",
            size: "16",
            color: "primary",
            class: "mr-2"
          }),
          _cache[32] || (_cache[32] = _createElementVNode("span", null, [
            _createElementVNode("strong", null, "彻底删除："),
            _createTextVNode("开启后会先执行普通删除，再到回收站中匹配同项目并二次删除")
          ], -1))
        ])
      ])
    ]),
    _createVNode(_component_v_snackbar, {
      modelValue: message.show,
      "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((message.show) = $event)),
      color: message.type,
      timeout: 2500,
      location: "top"
    }, {
      default: _withCtx(() => [
        _createTextVNode(_toDisplayString(message.text), 1)
      ]),
      _: 1
    }, 8, ["modelValue", "color"])
  ]))
}
}

};
const Config = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-1ddc2c43"]]);

export { Config as default };
