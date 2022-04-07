JS_PATH=/home/zrmin/webos/linuxonline/static/js/
JS_PATH_DIST=${JS_PATH}dist/ #注意：是{}不是（）
JS_PATH_SRC=${JS_PATH}src/

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}linuxonline.js
