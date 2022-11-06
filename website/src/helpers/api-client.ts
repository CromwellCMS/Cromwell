export type TRequestOptions = {
  /**
   * HTTP method: 'get', 'post', 'put', etc.
   */
  method?: string;
  /**
   * Body for 'post' and 'put' requests
   */
  input?: any;
  /**
   * Disable error logging
   */
  disableLog?: boolean;
  /**
   * Add headers
   */
  headers?: Record<string, string>;
};

export type TErrorInfo = {
  statusCode: number;
  message: string;
  route: string;
  disableLog?: boolean;
};

class ApiClient {
  public getBaseUrl = () => {
    return 'https://api.cromwellcms.com';
  };

  private handleError = async (
    response: Response,
    data: any,
    route: string,
    disableLog?: boolean,
  ): Promise<[any, TErrorInfo | null]> => {
    if (response.status >= 400) {
      const errorInfo: TErrorInfo = {
        statusCode: response.status,
        message: data?.message,
        route,
        disableLog,
      };
      return [data, errorInfo];
    }
    return [data, null];
  };

  public fetch = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
    const input = options?.input;
    let data;
    let errorInfo: TErrorInfo | null = null;
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) throw new Error('CentralServer URL is not defined');

    try {
      const res = await fetch(`${baseUrl}/api/${route}`, {
        method: options?.method ?? 'get',
        credentials: 'include',
        body: typeof input === 'string' ? input : input ? JSON.stringify(input) : undefined,
        headers: { 'Content-Type': 'application/json' },
      });
      const dataParsed = await res.json();
      [data, errorInfo] = await this.handleError(res, dataParsed, route, options?.disableLog);
    } catch (e) {
      errorInfo = {
        route,
        statusCode: 0,
        message: 'Could not connect to the Server. ' + String(e),
        disableLog: options?.disableLog,
      };
    }

    if (errorInfo) {
      throw Object.assign(new Error(), errorInfo);
    }

    return data;
  };

  public get = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
    return this.fetch(route, options);
  };

  public post = async <T>(route: string, input?: any, options?: TRequestOptions): Promise<T | undefined> => {
    return this.fetch(route, {
      method: 'post',
      input,
      ...(options ?? {}),
    });
  };

  async makeRequestToGitHub(url) {
    const response = await fetch(url);

    switch (response.status) {
      case 401:
        console.log('⚠ The token provided is invalid or has been revoked.', url);
        throw new Error('Invalid token');

      case 403:
        // See https://developer.github.com/v3/#rate-limiting
        if (response.headers.get('X-RateLimit-Remaining') === '0') {
          console.log('⚠ Your token rate limit has been exceeded.', url);
          throw new Error('Rate limit exceeded');
        }

        break;

      case 404:
        console.log('⚠ Repository was not found.', url);
        throw new Error('Repository not found');

      default:
    }

    if (!response.ok) {
      console.log('⚠ Could not obtain repository data from the GitHub API.', { response, url });
      throw new Error('Fetch error');
    }

    return response;
  }

  async getFrontendDependenciesBindings() {
    const files = await (
      await this.makeRequestToGitHub(
        'https://api.github.com/repos/CromwellCMS/bundled-modules/git/trees/master?recursive=1',
      )
    ).json();
    return files.tree
      .filter((file) => file.path.startsWith('versions/') && file.path.endsWith('.json'))
      .map((file) => file.path.replace('.json', '').replace('versions/', ''));
  }

  async getFrontendDependenciesList(version: string) {
    return await (
      await this.makeRequestToGitHub(
        `https://raw.githubusercontent.com/CromwellCMS/bundled-modules/master/versions/${version}.json`,
      )
    ).json();
  }
}

export const apiClient = new ApiClient();
