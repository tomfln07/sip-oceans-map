import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import config from "../../map_config.json"
import "./style.css"
import { motion } from "motion/react";

export const Pts_lists = forwardRef((props, ref) => {
	const [show_list, set_show_list] = useState(false);
	const [visited_pts, set_visited_pts] = useState(new Array(config.points.length).fill(false));
	var total_visited_pts = 0;

	for (let i = 0; i < visited_pts.length; i++) {
		if (visited_pts[i]) {
			total_visited_pts++;
		}
	}

	useEffect(() => {
		props.desactivate_nav(show_list);
	}, [show_list])
	const update_visited_pts = (visited_pt_index) => {
		var new_pts_list = visited_pts;
		new_pts_list[visited_pt_index] = true;
		set_visited_pts(new_pts_list);
	}
	useImperativeHandle(ref, () => ({ update_visited_pts }));
	const tp = (coords) => {
		props.update_coords(coords)
		set_show_list(false);
	}
	return (
		<>
		<motion.div 
			id="pts-list-btn" className="inter-500"
			initial={{ translateX: "-50%", translateY: 50, opacity: 0, scale: 0}}
			whileHover={{ scale: 1.1, translateX: "-50%", cursor: "pointer"}}
			whileTap={{ scale: 0.9, translateX: "-50%", cursor: "pointer" }}
			animate={{ translateY: 0, opacity: 1, scale: 1, transition: { delay: 2, duration: 0.3 } }}
			onClick={() => { set_show_list(true)}}
		>
			{
				total_visited_pts < visited_pts.length 
					? <p>{total_visited_pts} point(s) sur {visited_pts.length} vus</p>
					: <p>Tout les points ont été vus</p>
			}
		</motion.div>
		{ show_list ? <Pts_list_pop_up visited_pts={visited_pts} set_show_list={set_show_list} total_visited_pts={total_visited_pts} tp={tp}/> : null }
		</>
	)
})

const Pts_list_pop_up = ({visited_pts, set_show_list, total_visited_pts, tp}) => {
	return (
		<>
		<div id="pts-list-popup-bg" onClick={() => set_show_list(false)}></div>
		<motion.div 
			id="pts-list-popup" className="inter-500"
			initial={{ scale: 0, translateX: "-50%", translateY: "-50%" }}
			animate={{ scale: 1 }}
		>
			<div>
				<h3>À voir</h3>
			</div>
			{ total_visited_pts == visited_pts.length ? <h4 style={{ textAlign: "center", fontStyle: "italic", paddingTop: "10px" }}>Vous avez tout vu !</h4> : null }
			{config.points.map((pt, i) => !visited_pts[i] ? (
				<div className="pt">
					<p>{config.points[i].label}</p>
					<div className="go-to-btn" onClick={() => tp(config.points[i].coords)}>Aller</div>
				</div>
			) : null)}
			{
				total_visited_pts > 0 ? (
					<>
					<h3 style={{ marginTop: "25px" }}>Déjà vu</h3>
					{config.points.map((pt, i) => visited_pts[i] ? (
						<div className="pt">
							<p>{config.points[i].label}</p>
							<div className="go-to-btn" onClick={() => tp(config.points[i].coords)}>Aller</div>
						</div>
					) : null)}
					</>
				) : null
			}
			
		</motion.div>
		</>
	)
}