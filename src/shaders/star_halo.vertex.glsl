uniform float sphere_radius;
uniform vec3 sphere_position;
uniform float time;
uniform float time_multiplier;
uniform vec3 color_step_1;
uniform vec3 color_step_2;
uniform vec3 color_step_3;
uniform vec3 color_step_4;
uniform float ratio_step_1;
uniform float ratio_step_2;
varying float v_distance_to_surface;

void main()
{
    float camera_distance     = distance(sphere_position,cameraPosition);
    float angle               = asin(sphere_radius / camera_distance);
    float visible_radius      = tan(angle) * camera_distance;
    float distance_to_surface = distance(sphere_position,position) - visible_radius;

    // vec3 new_position = position;
    // new_position *= normal * perlin_1 * 10.0;

    v_distance_to_surface = distance_to_surface;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
