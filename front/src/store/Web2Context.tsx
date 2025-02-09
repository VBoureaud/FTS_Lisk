// @ts-ignore
import React, { useState } from "react";
import { buildRequest } from "@/utils/index";
import config, { apiServer } from "@/config/index";

type TypeContext = {
	loading: boolean;
	loadingCities: boolean;
	loadingUser: boolean;
	loadingUsers: boolean;
	loadingCreate: boolean;
	loadingMetaData: boolean;
	errorServer: boolean;
	simulationState: boolean;
	address: string;
	user: any | null;
	users: any | null;
	cities: any | null;
	metaDatas: any | null;
	data: any | null;
	createUser: (data: any) => {};
	getUser: (address: string) => {};
	getAllUsers: Function;
	getCities: Function;
	getMetaData: Function;
	setDisconnected: Function;
	updateSimulation: Function;
};

const Web2Context = React.createContext<TypeContext>({
	loading: false,
	loadingCities: false,
	loadingUser: false,
	loadingUsers: false,
	loadingCreate: false,
	loadingMetaData: false,
	errorServer: false,
	simulationState: true,
	user: null,
	users: null,
	cities: null,
	metaDatas: null,
	createUser: (data: any) => { },
	getUser: (address: string) => { },
	getAllUsers: () => { },
	getCities: () => { },
	getMetaData: () => { },
	setDisconnected: () => { },
	updateSimulation: (sim: boolean) => { },
});

type Props = {
	children: React.ReactNode;
};

export const Web2ContextProvider = (props: Props) => {
	const [loading, setLoading] = useState(false);
	const [loadingCities, setLoadingCities] = useState(false);
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [loadingUser, setLoadingUser] = useState(false);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [loadingMetaData, setLoadingMetaData] = useState(false);
	const [errorServer, setErrorServer] = useState(false);
	const [simulationState, setSimulationState] = useState(true);

	const [user, setUser] = useState<any | null>(null);
	const [users, setUsers] = useState(null);
	const [cities, setCities] = useState(null);
	const [metaDatas, setMetaDatas] = useState(null);

	const createUser = async (data: any) => {
		console.log("createUser");
		try {
			setLoadingCreate(true);
			const rsp = await buildRequest(
				apiServer.register.url,
				apiServer.register.method,
				data
			);
			console.log({ create: rsp });
			setLoadingCreate(false);
			await getUser(data.address);
		} catch (e) {
			console.log({ e });
		}
	}

	const getUser = async (address: string) => {
		console.log("getUser");
		try {
			setLoadingUser(true);
			const rsp = await buildRequest(
				apiServer.getUser.url + `/${address}`,
				apiServer.getUser.method,
			);
			setUser(rsp.user);
			setLoadingUser(false);
		} catch (e) {
			console.log({ e });
			setLoadingUser(false);
			setErrorServer(true);
		}
	}

	const getAllUsers = async () => {
		console.log("getAllUsers");
		try {
			setLoadingUsers(true);
			const rsp = await buildRequest(
				apiServer.getAllUsers.url,
				apiServer.getAllUsers.method,
			);
			setUsers(rsp.results);
			setLoadingUsers(false);
		} catch (e) {
			console.log({ e });
		}
	}

	const getCities = async () => {
		console.log("getCities");
		try {
			setLoadingCities(true);
			setLoadingCities(false);
		} catch (e) {
			console.log({ e });

		}
	}

	const getMetaData = async () => {
		console.log("getMetaData");
		try {
			setLoadingMetaData(true);
			const rsp = await buildRequest(
				apiServer.getAllNFTS.url,
				apiServer.getAllNFTS.method,
			);
			setMetaDatas(rsp.nfts);
			setLoadingMetaData(false);
		} catch (e) {
			console.log({ e });
		}
	}

	const setDisconnected = () => {
		setUser(null);
	}

	const updateSimulation = (sim: boolean) => {
		setSimulationState(sim)
	}

	return (
		<Web2Context.Provider
			value={{
				loading,
				loadingCities,
				loadingCreate,
				loadingUser,
				loadingUsers,
				loadingMetaData,
				errorServer,
				simulationState,
				user,
				users,
				cities,
				metaDatas,
				createUser,
				getUser,
				getAllUsers,
				getCities,
				getMetaData,
				setDisconnected,
				updateSimulation,
			}}>
			{props.children}
		</Web2Context.Provider>
	)
}


export default Web2Context;