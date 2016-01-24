uniform float time;
uniform float time_multiplier;
uniform vec3 color_step_1;
uniform vec3 color_step_2;
uniform vec3 color_step_3;
uniform vec3 color_step_4;
uniform float ratio_step_1;
uniform float ratio_step_2;
varying float v_distance_to_surface;

vec3 get_color_from_gradient(float value)
{
    vec3 color;

    if(value < ratio_step_1)
    {
        value = smoothstep(0.0,ratio_step_1,value);
        color = mix( color_step_1, color_step_2, vec3(value,value,value));
        // color = vec3(1.0,0.0,0.0);
    }
    else if(value < ratio_step_2)
    {
        value = smoothstep(ratio_step_1,ratio_step_2,value);
        color = mix( color_step_2, color_step_3, vec3(value,value,value));
        // color = vec3(0.0,1.0,0.0);
    }
    else
    {
        value = smoothstep(ratio_step_2,1.0,value);
        color = mix( color_step_3, color_step_4, vec3(value,value,value));
        // color = vec3(0.0,0.0,1.0);
    }

    return color;
}

void main()
{
    float halo_1_radius = 0.03;
    float strength_1 = (1.0 - v_distance_to_surface / halo_1_radius);

    float halo_2_radius = 1.0;
    float strength_2 = (1.0 - v_distance_to_surface / halo_2_radius);

    vec4 color_1 = vec4(get_color_from_gradient(strength_1),strength_1);
    vec4 color_2 = vec4(get_color_from_gradient(strength_2 - 0.7),strength_2);

    color_1 = clamp(color_1,vec4(0.0,0.0,0.0,0.0),vec4(1.0,1.0,1.0,1.0));
    color_2 = clamp(color_2,vec4(0.0,0.0,0.0,0.0),vec4(1.0,1.0,1.0,1.0));

    gl_FragColor = color_1 + color_2 * 0.65;
}
