'use client';
import React, { useState, useRef, useEffect } from 'react';
//import ChooseCollection from './ChooseCollection';
import p5 from 'p5';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import {
	nameTypeToken
} from '@/utils/gameEngine';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const randColorPlay = ['#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750'];

type GameIceTokenProps = {
	cost?: string;
	type?: string;
	tokenName?: string;

	// used
	onVictory?: Function;
	onLose?: Function;
	canPlay?: boolean;
	onLaunch?: Function;
};

type ObjCollide = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);
const random = (max: number) => Math.floor(Math.random() * max);
const shuffle = (a: number[]) => {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
const isCollide = (a: ObjCollide, b: ObjCollide) => {
	return !(
		((a.y + a.height) < (b.y)) ||
		(a.y > (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width))
	);
}

const GameIceToken: React.FunctionComponent<GameIceTokenProps> = (props) => {
	const [step, setStep] = useState(0);
	const [names, setNames] = useState([]);
	const needCollectionIn = Object.keys(nameTypeToken).filter((e: string) => nameTypeToken[e].profile === 'farmer' || (nameTypeToken[e].profile === 'cook' && e !== '001000'));
	const needCollectionNum = 1;// minimum 1 item match between props.collection & needCollectionIn
	const needCollectionNumMax = 1;// maximum 1 items match between props.collection & needCollectionIn
	const limitTime = 20;
	const [count, setCount] = useState(0);
	const [score, setScore] = useState(0);
	const [total, setTotal] = useState(1);

	// p5
	const p5Ref = useRef();
	const containDiv = useRef<HTMLInputElement>(null);
	let myP5Canvas: any = null;

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (step == 1) {
			timeout = setTimeout(() => {
				setCount(count + 1);
			}, 1000);
		}
		return () => clearTimeout(timeout);
	}, [count]);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (step == 0 && props.onLaunch)
			props.onLaunch(false);
		else if (step == 1) {
			myP5Canvas = new p5(sketch, p5Ref.current);
			setCount(1);
		} else if (step == 2) {
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onVictory) props.onVictory(props.type, names);
			}, 3500);
		} else if (step == 3) { // lose
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onLose) props.onLose();
			}, 3500);
		}

		// like componentDidUnMount
		return () => clearTimeout(timeout);
	}, [step]);

	const setWin = () => {
		if (step == 1) {
			if (myP5Canvas) {
				myP5Canvas.remove();
			}
			setStep(2);
		}
	}

	const setLose = () => {
		if (step == 1) {
			if (myP5Canvas) myP5Canvas.remove();
			setStep(3);
		}
	}

	const handleLaunch = () => {
		if (props.canPlay)
			setStep(1);
		if (props.onLaunch)
			props.onLaunch(true);
	};

	const findRandom = (playerCenter: number[], width: number, height: number, size: number) => {
		let newX = random(width);
		let newY = random(height);
		const offset = 50;

		if (Math.abs(playerCenter[0] - newX) <= offset + size)
			newX = width - playerCenter[0];
		if (Math.abs(playerCenter[1] - newY) <= offset + size)
			newY = height - playerCenter[1];
		return [newX < 0 ? 0 : newX, newY < 0 ? 0 : newY];
	}

	const sketch = (p: any) => {
		let centerX = 0.0, centerY = 0.0;
		let radius = 45, rotAngle = -90;
		let accelX = 0.0, accelY = 0.0;
		let deltaX = 0.0, deltaY = 0.0;
		let springing = 0.0009, damping = 0.98;
		let drawTime = 0;

		//corner nodes
		let nodes = 5;

		// mouse
		let x: number,
			y: number;

		//zero fill arrays
		let nodeStartX: number[] = [];
		let nodeStartY: number[] = [];
		let nodeX: number[] = [];
		let nodeY: number[] = [];
		let angle: number[] = [];
		let frequency: number[] = [];
		let winCircle: number[] = [];

		// soft-body dynamics
		let organicConstant = 1.0;

		let width: number = 720;
		let height: number = 350;

		p.setup = () => {
			if (containDiv && containDiv.current) {
				width = containDiv?.current?.getBoundingClientRect().width;
			}
			p.createCanvas(width, 350);

			//center shape in window
			centerX = parseInt('' + width) / 2;
			centerY = parseInt('' + height) / 2;

			//initialize arrays to 0
			for (let i = 0; i < nodes; i++) {
				nodeStartX[i] = 0;
				nodeStartY[i] = 0;
				nodeY[i] = 0;
				nodeY[i] = 0;
				angle[i] = 0;
			}

			// iniitalize frequencies for corner nodes
			for (let i = 0; i < nodes; i++) {
				frequency[i] = p.random(5, 12);
			}

			winCircle = findRandom([centerX, centerY], width, height, 50);
			x = p.width / 2;
			y = p.height / 2;

			p.noStroke();
			p.frameRate(30);
		}
		p.draw = () => {
			//fade background
			p.fill(0, 100);
			p.rect(0, 0, width, height);

			for (let i = 0; i < nodes; i++) {
				nodeStartX[i] = centerX + p.cos(p.radians(rotAngle)) * radius;
				nodeStartY[i] = centerY + p.sin(p.radians(rotAngle)) * radius;
				rotAngle += 360.0 / nodes;
			}

			// draw polygon
			p.curveTightness(organicConstant);
			p.fill(255);
			p.beginShape();
			for (let i = 0; i < nodes; i++) {
				p.curveVertex(nodeX[i], nodeY[i]);
			}
			for (let i = 0; i < nodes - 1; i++) {
				p.curveVertex(nodeX[i], nodeY[i]);
			}
			p.endShape(p.CLOSE);

			//move center point
			deltaX = p.mouseX - centerX;
			deltaY = p.mouseY - centerY;

			// create springing effect
			deltaX *= springing;
			deltaY *= springing;
			accelX += deltaX;
			accelY += deltaY;

			// move predator's center
			centerX += accelX;
			centerY += accelY;

			// slow down springing
			accelX *= damping;
			accelY *= damping;

			// change curve tightness
			organicConstant = 1 - ((p.abs(accelX) + p.abs(accelY)) * 0.1);

			//move nodes
			for (let i = 0; i < nodes; i++) {
				nodeX[i] = nodeStartX[i] + p.sin(p.radians(angle[i])) * (accelX * 2);
				nodeY[i] = nodeStartY[i] + p.sin(p.radians(angle[i])) * (accelY * 2);
				angle[i] += frequency[i];
			}

			p.circle(winCircle[0], winCircle[1], 50);

			// action
			if (isCollide(
				{ x: centerX, y: centerY, width: 20, height: 20 },
				{ x: winCircle[0], y: winCircle[1], width: 50, height: 50 })) {
				setScore(score + 1);
				winCircle = findRandom([centerX, centerY], width, height, 50);
				setWin();
				//if (score == total)
			}

			if (drawTime % 100 === 0)
				winCircle = findRandom([centerX, centerY], width, height, 50);

			// frameRATE * limittime
			if (drawTime === 30 * (limitTime - 1))
				setLose();

			drawTime += 1;
		}
	}

	return (
		<Box sx={{ width: '100%' }}>
			{step == 0 &&
				<Box onClick={handleLaunch}>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play <PlayCircleFilledWhiteIcon sx={{ ":hover": { color: randColorPlay[random(randColorPlay.length)] }, fontSize: '40px' }} /></Typography>
					{props.cost && <Typography variant="h6">Cost estimated {props.cost} XRP</Typography>}
					<Typography sx={{ ml: 1 }} variant="body1"><b>Ice Move</b> - Play and try to win an NFT.</Typography>
				</Box>}
			{step == 1 && <>
				<Box ref={containDiv} sx={{ position: 'relative', width: '100%' }}>
					<Box sx={{
						'position': 'absolute',
						'top': '5px',
						'marginLeft': '10px',
						'fontSize': '40px',
						'color': 'white',
					}}>{count} / {limitTime}</Box>
					<Box sx={{
						'position': 'absolute',
						'top': '5px',
						'right': '5px',
						'marginLeft': '10px',
						'fontSize': '20px',
						'color': 'white',
					}}>{score} / {total}</Box>

					<div ref={p5Ref}>
					</div>
				</Box>
			</>}
			{step == 2 && <>
				<Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
				<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
			</>}
			{step == 3 && <>
				<Typography variant="h4" sx={{ cursor: 'pointer' }}>You lost, but you can try again.</Typography>
				<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
			</>}
		</Box>
	);
}

export default GameIceToken;