export interface Choice {
	id: string
	text: string
	value: string
}

export interface FlowInput {
	id: string
	text: string
	type: "radio" | "text"
	choices?: Choice[]
}

export interface FlowPage {
	id: string
	inputs: FlowInput[]
}

export interface Customizations {
	choices: Choice[]
}
