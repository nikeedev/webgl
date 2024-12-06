#version 100
precision highp float;

attribute vec3 a_pos;
attribute vec2 a_texCoord;

uniform float yOffset;

varying vec2 v_texCoord;

void main() {
    vec3 temp = a_pos;
    temp.y = yOffset;
    gl_Position = vec4(temp, 1.0);
    v_texCoord = a_texCoord;
}
