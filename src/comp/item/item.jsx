import { useEffect, useRef, useState } from "react"
import "./style.css"
import exclamation_marck from "../../assets/Exclamation_flat_icon.png"
import validate from "../../assets/check-512.png"
import config from "../../map_config.json"
import { Popup } from "../popup/popup"

export function Item({ coords_ref, pt_index, desactivate_nav, update_visited_pts}) {
	const item_ref = useRef(null);
	const [is_active, set_is_active] = useState(true);
	const [show_popup, set_show_popup] = useState(false);
	const pt_data = useRef(config.points[pt_index]);

	useEffect(() => {
		const id = setInterval(() => {
			const coords = [
				window.innerWidth / 2 - coords_ref.current[0] + pt_data.current.coords[0],
				window.innerHeight / 2 - coords_ref.current[1] + pt_data.current.coords[1]
			]

			if (item_ref) {
				item_ref.current.style.left = `${coords[0]}px`;
				item_ref.current.style.top = `${coords[1]}px`;
			}
		}, 10);

		return () => { clearInterval(id) }
	}, []);

	useEffect(() => {
		desactivate_nav(show_popup)
	}, [show_popup]);

	const click = e => {
		set_is_active(false);
		set_show_popup(true);
		desactivate_nav(true);
	}

	return (
		<>
			<div className="item" ref={item_ref} style={{ 
				scale: `${pt_data.current.scale ? `${pt_data.current.scale}` : "1"}`,
				top: `${window.innerHeight / config.pt_label_ratio}`
			}}>
				<img src={is_active ? exclamation_marck : validate} className={`point-icon ${is_active ? "seek-attention" : null}`} onClick={click}/>
				<h1 className="label rubik-400">{pt_data.current.label}</h1>
			</div>
			{ show_popup ? <Popup 
				pt_data={pt_data.current}
				unshow_popup={(unshow) => { update_visited_pts(pt_index); set_show_popup(!unshow) }}
			/> : null}
		</>
	)
}