interface IConfig {
  api: string
}

export const config: IConfig = {
  api: process.env.REACT_APP_OPENAI_API_KEY as string,
}
