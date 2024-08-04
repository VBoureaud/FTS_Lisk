import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5";

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef) => void;
type P5jsContainer = ({ sketch }: { sketch: P5jsSketch }) => React.JSX.Element;

const randColorPlay = ['#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750'];
const random = (max: number) => Math.floor(Math.random() * max);

type P5GameProps = {
  cost?: string;
  type?: string;
  tokenName?: string;
  ruleSketch?: { title: string; description: string; };

  // used
  onVictory?: Function;
  onLose?: Function;
  canPlay?: boolean;
  onLaunch?: Function;

  sketch: Function;
};

const P5jsContainer: React.FunctionComponent<P5GameProps> = (props) => {
  const parentRef = useRef<P5jsContainerRef>();
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const [step, setStep] = useState(0);
  const enumStep = {
    'init': 0,
    'launch_game': 1,
    'victory': 2,
    'fail': 3,
  };
  let p5instance: p5Types = {};

  const actionFunction = (type: number) => {
    if (type === enumStep.victory) setWin();
    else if (type === enumStep.fail) setLose();
  }
  const initP5 = async () => {
    try {
      if (!props.sketch) return false;
      // import the p5 and p5-sounds client-side
      const p5 = (await import("p5")).default;
      new p5((p) => {
        props.sketch(p, parentRef.current, actionFunction);
        p5instance = p;
      });
    } catch (error) {
      console.log(error);
    }
  };

  // on mount
  /*useEffect(() => {
    console.log('setIsMounted');
    setIsMounted(true);
    return setIsMounted(false);
  }, [])*/

  useEffect(() => {
    // if (!isMounted) return;
    let timeout: ReturnType<typeof setTimeout>;
    if (step == enumStep.init && props.onLaunch)
      props.onLaunch(false);
    else if (step == enumStep.launch_game) { // game
      //p5instance = new p5(sketch, p5Ref.current);
      initP5();
    }
    else if (step == enumStep.victory) {
      timeout = setTimeout(() => {
        setStep(enumStep.init);
        if (props.onVictory) props.onVictory(props.type);
      }, 3500);
    }
    else if (step == enumStep.fail) { // lose
      timeout = setTimeout(() => {
        setStep(enumStep.init);
        if (props.onLose) props.onLose();
      }, 3500);
    }

    // like componentDidUnMount
    return () => clearTimeout(timeout);
  }, [isMounted, step]);

  const setWin = () => {
    if (step == enumStep.launch_game) {
      if (p5instance) {
        p5instance.remove();
      }
      setStep(enumStep.victory);
    }
  }

  const setLose = () => {
    if (step == enumStep.launch_game) {
      if (p5instance) p5instance.remove();
      setStep(enumStep.fail);
    }
  }

  const handleLaunch = () => {
    if (props.canPlay)
      setStep(enumStep.launch_game);
    if (props.onLaunch)
      props.onLaunch(true);
  };

  //return <div ref={parentRef}></div>;
  return (
    <Box sx={{ width: '100%' }}>
      {step == enumStep.init &&
        <Box onClick={handleLaunch}>
          <Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play <PlayCircleFilledWhiteIcon sx={{ ":hover": { color: randColorPlay[random(randColorPlay.length)] }, fontSize: '40px' }} /></Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}><b>{props.ruleSketch && props.ruleSketch.title}</b> - {props.ruleSketch && props.ruleSketch.description}{props.tokenName ? ' a ' + props.tokenName : ''}.</Typography>
          {props.cost && <Typography sx={{ fontSize: '15px' }} variant="h6">Cost estimated {props.cost} ETH</Typography>}
        </Box>}
      {step == enumStep.launch_game && !p5instance &&
        <Box sx={{ width: '100%' }}>
          Loading...
        </Box>}
      {step == enumStep.launch_game && p5instance &&
        <Box ref={parentRef} sx={{ width: '100%' }}>
        </Box>}
      {step == enumStep.victory && <Box>
        <Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
        <CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
      </Box>}
      {step == enumStep.fail && <Box>
        <Typography variant="h2" sx={{ cursor: 'pointer' }}>You Lose!</Typography>
        <CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
      </Box>}
    </Box>
  );
};

export default P5jsContainer;