#version 100
precision highp float;

attribute vec3 aPos;
varying vec4 color;

attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
    gl_Position = vec4(aPos, 1.0);
    color = vec4(1.0, 0.57, 0.0, 1.0);
    v_texCoord = a_texCoord;
}