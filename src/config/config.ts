interface IConfig {
  api: string,
  proxyHost: string,
  proxyPort: number,
}

export const config: IConfig = {
  api: process.env.REACT_APP_OPENAI_API_KEY as string,
  proxyHost: process.env.REACT_APP_PROXY_HOST as string,
  proxyPort: parseInt(process.env.REACT_APP_PROXY_PORT as string, 10),
}
