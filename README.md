webgl1 version of my 3d engine made on vanilla JavaScript.

you can see it in action here:

https://3dminiwebgl.pages.dev/

it was made on a phone so I haven't even tried to make it look nice on desktop.


this one is using individual vertices per triangle and calculating blinn-phong on the fragment shader but it could be per vertex instead. still performing faster than libraries since it's raw webgl with no overhead or abstraction. 

also not using typed array buffers on creation and just nested arrays. I tried typed buffers on another iteration but if it is just for loading, I don't think it will get better performance on runtime since everything is preloaded to the GPU and only updating matrices inside the loop.
