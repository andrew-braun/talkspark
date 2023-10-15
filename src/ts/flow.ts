export interface Choice {
	id: string
	text: string
	value: string
	emoji?: string
}

export interface FlowInput {
	id: string
	text: string
	type: "radio" | "text"
	choices?: Choice[]
}

export interface FlowPageProps {
	id: string
	pageNumber: number
	inputs: FlowInput[]
}

export interface Customizations {
	choices: Choice[]
}
