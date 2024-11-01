import { useEffect, useRef, useState } from "react"
import { Item } from "../item/item";
import "./style.css"
import world from "../../assets/8081_earthmap10k.jpg"

export function Map() {
	const coords = useRef([5600, 1342]);
	const mouse_pos_origin = useRef(null);
	const zoom = useRef(1);
	const world_img = useRef(null);
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

	useEffect(() => {
		update_world_img_pos(coords.current);
	}, [window.innerHeight, window.innerWidth]);

	useEffect(() => {
		const mouse_down = (e) => {
			if (e.button == "0") {
				mouse_pos_origin.current = [e.clientX, e.screenY];
				window.addEventListener("mousemove", track_mouse);
			}
		}

		const mouse_up = (e) => {
			if (e.button == "0") {
				window.removeEventListener("mousemove", track_mouse);
				mouse_pos_origin.current = null;
			}
		}

		const wheel = (e) => {
			if (e.deltaY < 0) {
				zoom.current += 0.1;
			} else if (zoom.current > 0) {
				zoom.current -= 0.1;
			}
			if (zoom.current < 0) zoom.current = 0;
			update_world_img_zoom();
		}

        function preventDefault(e) {
            e.preventDefault();
        }

		window.addEventListener("mousedown", mouse_down);
		window.addEventListener("mouseup", mouse_up);
		window.addEventListener(wheelEvent, preventDefault);
        window.addEventListener("resize", () => update_world_img_pos(coords.current))

		return () => {
			window.removeEventListener("mousedown", mouse_down);
			window.removeEventListener("mouseup", mouse_up);
			window.removeEventListener("mousemove", track_mouse);
			window.removeEventListener(wheelEvent, preventDefault);
            window.removeEventListener("resize", update_world_img_pos)
			//window.removeEventListener("wheel", wheel);
		}
	}, [])
	
	const track_mouse = (e) => {
		if (!mouse_pos_origin) return;
		const delta_x = mouse_pos_origin.current[0] - e.clientX;
		const delta_y = mouse_pos_origin.current[1] - e.screenY;
		coords.current = [coords.current[0] + delta_x, coords.current[1] + delta_y];
		update_world_img_pos(coords.current);
		mouse_pos_origin.current = [e.clientX, e.screenY];
	}

	const update_world_img_pos = (pos) => {
        console.log(pos);
        if (world_img) {
			world_img.current.style.top = `${window.innerHeight / 2 - pos[1]}px`;
			world_img.current.style.left = `${window.innerWidth / 2 - pos[0]}px`;
		}
	}

	const update_world_img_zoom = () => {
		if (world_img) {
			world_img.current.style.transform = `scale(${zoom.current})`;
		}
	}

	return (
		<>
			<div style={{ height: `100vh`, width: `100vw` }} id="map_container">
                <div id="barrier"></div> {/* disallow user to drag-and-drop workd img (preventing bugs when moving on the map) */}
				<img src={world} id="world" ref={world_img}/>
				<Item x={50} y={50} coords_ref={coords}/>
			</div>
		</>
	)
}