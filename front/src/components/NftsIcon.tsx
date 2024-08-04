import React from 'react';

import {
	unPad,
	displayDate,
} from "@/utils";
import {
	translateImageSpecsToCss,
	nameTypeToken,
} from "@/utils/gameEngine";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ParkIcon from '@mui/icons-material/Park';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';

import '@/utils/TypeToken.css';

type NftsIconProps = {
	nftTokenName: string;
	//uris?: Uri[];
	user?: string;
	tokenType: string;
	tokenDate?: string | Date;
	tokenIssuer?: string;
	tokenOwner?: string;
	names?: { [key: string]: string };
	validity?: boolean;
	sizeCss: string;
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const NftsIcon: React.FunctionComponent<NftsIconProps> = (props) => {
	const author = props.user && props.tokenIssuer && props.user === props.tokenIssuer
		? 'you'
		: props.tokenIssuer && props.names && props.names[props.tokenIssuer]
			? props.names[props.tokenIssuer]
			: props.tokenIssuer;
	const image = props.tokenType.split('#')[0];
	let child =
		<Tooltip title={props.tokenType && nameTypeToken[image] ? capitalize(nameTypeToken[image].name) + (author ? ' by ' + author : '') : 'Empty'} placement="bottom-start">
			<div className={`${props.validity ? "avatarToken" : "avatarToken notValid"} ${author != 'you' && props.tokenType ? " buyToken" : " ownToken"}`}>
				<Box
					style={{
						margin: 'auto',
						filter: translateImageSpecsToCss(props.tokenType),
						WebkitFilter: translateImageSpecsToCss(props.tokenType),
						//MozFilter: translateImageSpecsToCss(props.tokenType),
						//OFilter: translateImageSpecsToCss(props.tokenType),
						//MsFilter: translateImageSpecsToCss(props.tokenType),
						//-moz-filter: translateImageSpecsToCss(props.tokenType),
						//-o-filter: translateImageSpecsToCss(props.tokenType),
						//-ms-filter: translateImageSpecsToCss(props.tokenType),
					}}
					className={props.sizeCss + unPad(image)}
				></Box>
			</div>
		</Tooltip>;

	return (
		<>
			{child}
		</>
	);
}

export default NftsIcon;