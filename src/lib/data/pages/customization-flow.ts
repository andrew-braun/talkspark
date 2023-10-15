import type { FlowInput, FlowPageProps } from "ts/flow"

const page1Inputs: FlowInput[] = [
	{
		id: "relationship-type",
		type: "radio",
		text: "Type of relationship",
		choices: [
			{
				id: "relationship-type-romantic",
				text: "Romantic",
				emoji: "💖",
				value: "romantic",
			},
			{
				id: "relationship-type-professional",
				text: "Professional",
				emoji: "💼",
				value: "professional",
			},
			{
				id: "relationship-type-friend",
				text: "Friend",
				emoji: "😊",
				value: "friend",
			},
			{
				id: "relationship-type-family",
				text: "Family",
				emoji: "👩🏽‍👩🏽‍👧🏽‍👦🏽",
				value: "family",
			},
			{
				id: "relationship-type-acquaintance",
				text: "Acquaintance",
				emoji: "👋🏽",
				value: "acquaintance",
			},
		],
	},
	{
		id: "relationship-type",
		type: "text",
		text: "Other",
	},
]
const page2Inputs: FlowInput[] = [
	{
		id: "relationship-depth",
		type: "radio",
		text: "Depth of relationship",
		choices: [
			{
				id: "relationship-depth-0",
				text: "This is our first time meeting",
				value: "0",
			},
			{
				id: "relationship-depth-1",
				text: "We know each other, but not well",
				value: "0",
			},
			{
				id: "relationship-depth-2",
				text: "We know each other quite well",
				value: "2",
			},
			{
				id: "relationship-depth-3",
				text: "We know each other very well",
				value: "3",
			},
		],
	},
]

export const customizationFlowPages: FlowPageProps[] = [
	{
		id: "page-1",
		pageNumber: 1,
		inputs: page1Inputs,
	},
	{ id: "page-2", pageNumber: 2, inputs: page2Inputs },
]
