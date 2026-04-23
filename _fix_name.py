import os
f = r'C:\Users\Administrator\WorkBuddy\20260423145307\plugins.v2\guangyadisk\__init__.py'
t = open(f, encoding='utf-8').read()
t = t.replace('plugin_name = "光鸭云盘"', 'plugin_name = "Shuk-光鸭云盘"')
t = t.replace('_disk_name = "光鸭云盘"', '_disk_name = "Shuk-光鸭云盘"')
t = t.replace('\u3010\u5149\u9e2d\u4e91\u76d8\u3011', '\u3010Shuk-\u5149\u9e2d\u4e91\u76d8\u3011')
open(f, 'w', encoding='utf-8').write(t)
print(f'Done. Shuk count: {t.count("Shuk")}')
