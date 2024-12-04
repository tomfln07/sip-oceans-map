import { useEffect, useRef, useState } from "react"
import { Item } from "../item/item";
import "./style.css"
import world from "../../assets/8081_earthmap10k.jpg"
import config from "../../map_config.json"
import { Pts_lists } from "../pts_list/pts_list";

export function Map() {
	const map_ref = useRef();
	const coords = useRef(config.default_coords);
	const mouse_pos_origin = useRef(null);
	//const zoom = useRef(1);
	const world_img = useRef(null);
	const inf1 = useRef(null);
	const inf2 = useRef(null);
	const is_clicking = useRef(false);
	const [is_nav_disabled, set_is_nav_disabled] = useState(false);
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
	var is_on_mobile = /Mobi|Android/i.test(navigator.userAgent);
	var move_speed_factor = is_on_mobile ? config.move_speed_factor.touch_screen : config.move_speed_factor.mouse;

	const update_world_img_pos = (pos) => {
		if (world_img) {
			world_img.current.style.top = `${window.innerHeight / 2 - pos[1]}px`;
			world_img.current.style.left = `${window.innerWidth / 2 - pos[0]}px`;
		}
	}

	useEffect(() => {
		if (import.meta.env.DEV) {
			setInterval(() => {
				if (inf1.current && inf2.current) {
					inf1.current.innerText = `x: ${coords.current[0]} | y: ${coords.current[1]};`;
					inf2.current.innerText = `rendered x: ${window.innerWidth / 2 - coords.current[0]} | rendered y: ${window.innerHeight / 2 - coords.current[1]}`;
				}
			}, 50);
		}
		console.log(`${is_on_mobile ? "Touch screen" : "Mouse"} tracking mode.`);
		update_world_img_pos(coords.current);
	}, []);

	useEffect(() => {
		const mouse_down = (e) => {
			if (e.button === 0) {
				mouse_pos_origin.current = [e.clientX, e.clientY];
				is_clicking.current = true;
			}
		}

		const mouse_up = (e) => {
			if (e.button === 0) {
				is_clicking.current = false;
			}
		}

		const start_touch = (e) => {
			mouse_pos_origin.current = [e.touches[0].clientX, e.touches[0].clientY];
		}

		const track_touch = e => {
			if (is_nav_disabled) return;
			e.preventDefault();
			update_map_pos(mouse_pos_origin.current, [e.touches[0].clientX, e.touches[0].clientY]);
		}
		
		const track_mouse = e => {
			if (!mouse_pos_origin || !is_clicking.current || is_nav_disabled) return;
			update_map_pos(mouse_pos_origin.current, [e.clientX, e.clientY]);
		}

		const update_map_pos = (last_pos, new_pos) => {
			if (!last_pos || !new_pos) return;
			var delta_x = parseInt((last_pos[0] - new_pos[0]) * move_speed_factor);
			var delta_y = parseInt((last_pos[1] - new_pos[1]) * move_speed_factor);
			if (window.innerWidth / 2 - (coords.current[0] + delta_x) > 0
				|| coords.current[0] + delta_x + window.innerWidth / 2 > world_img.current.width) delta_x = 0;
			if (window.innerHeight / 2 - (coords.current[1] + delta_y) > 0
				|| coords.current[1] + delta_y + window.innerHeight / 2 > world_img.current.height) delta_y = 0;
			const updated_pos = [coords.current[0] + delta_x, coords.current[1] + delta_y];
			coords.current = updated_pos;
			update_world_img_pos(coords.current);
			mouse_pos_origin.current = new_pos;
		}

		const resize = () => {
			update_world_img_pos(coords.current); // Used for debug
			/*is_on_mobile = /Mobi|Android/i.test(navigator.userAgent);
			move_speed_factor = is_on_mobile ? config.move_speed_factor.touch_screen : config.move_speed_factor.mouse;*/
		}
	
		/*const update_world_img_zoom = () => {
			if (world_img) {
				world_img.current.style.transform = `scale(${zoom.current})`;
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
		}*/

        const preventDefault = (e) => { e.preventDefault() }

		if (!is_on_mobile) {
			// MOUSE MOVES
			window.addEventListener("mousedown", mouse_down);
			window.addEventListener("mouseup", mouse_up);
			window.addEventListener("mousemove", track_mouse);
		} else {
			// SCREEN TOUCH MOVE
			window.addEventListener("touchstart", start_touch);
			window.addEventListener("touchmove", track_touch, { passive: false });
		}

		// PREVENTING MAP BUGS
		window.addEventListener(wheelEvent, preventDefault);
        window.addEventListener("resize", resize);

		return () => {
			// MOUSE MOVES
			window.removeEventListener("mousedown", mouse_down);
			window.removeEventListener("mouseup", mouse_up);
			window.removeEventListener("mousemove", track_mouse);
			
			// SCREEN TOUCH MOVE
			window.removeEventListener("touchstart", start_touch);
			window.removeEventListener("touchmove", track_touch, { passive: false });
			
			// PREVENTING MAP BUGS
			window.removeEventListener(wheelEvent, preventDefault);
            window.removeEventListener("resize", resize);
		}
	}, [is_nav_disabled])

	// Can't directly pass map_ref.current.update_visited_pts() 
	// as map_ref.current don't exists at first render.
	// Passing this wrapper calls update_visited_pts from its ref
	// if it exists
	const update_visited_pts_wrapper = (visited_pt_index) => {
		if (map_ref.current) {
			map_ref.current.update_visited_pts(visited_pt_index);
		}
	}

	const update_coords = (new_coords) => {
		coords.current = new_coords;
		update_world_img_pos(coords.current);
		set_is_nav_disabled(false);
	}

	return (
		<>
			<div style={{ height: `100vh`, width: `100vw` }} id="map_container">
                <div id="barrier"></div> {/* disallow user to drag-and-drop world img (preventing bugs when moving on the map) */}
				{ import.meta.env.DEV ?
					<div id="infos">
						<p ref={inf1}>x: | y: </p>
						<p ref={inf2}>rendered x: | rendered y: </p>
						<p>screen width: {window.innerWidth} | screen height: {window.innerHeight}</p>
						<p>tracking mode: {is_on_mobile ? "touch screen" : "mouse"}</p>
					</div> : null
				}
				<img src={world} id="world" ref={world_img}/>
				{
					config.points.map((element, index) => (
						<Item 
							key={index} 
							pt_index={index}
							coords_ref={coords}
							desactivate_nav={(bool) => set_is_nav_disabled(bool)}
							update_visited_pts={update_visited_pts_wrapper}
						/>
					))
				}
			</div>
			<Pts_lists ref={map_ref} coords_ref={coords} update_coords={update_coords} desactivate_nav={(bool) => set_is_nav_disabled(bool)}/>
		</>
	)
}