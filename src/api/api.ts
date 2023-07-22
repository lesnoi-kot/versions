import * as d3 from "d3";

import { Release, Source } from "models/models";
import { getPublishedAt } from "models/getters";

type APIConfig = {
  baseURL: string;
};

type GetSourcesFilters = {
  count?: number;
  page?: number;
  name?: string;
};

type GetSourcesDTO = {
  totalCount: number;
  data: Source[];
};

export class API {
  baseURL: string;

  constructor(config: APIConfig) {
    this.baseURL = config.baseURL;
  }

  async getSources(filters: GetSourcesFilters): Promise<GetSourcesDTO> {
    const { count = 10, page = 0, name } = filters;
    const url = new URL("sources/", this.baseURL);

    url.searchParams.append("count", String(count));
    url.searchParams.append("page", String(page));
    if (name) {
      url.searchParams.append("name", name);
    }

    const resp = await fetch(url);
    const body = await resp.json();

    return {
      totalCount: body.totalCount,
      data: body.data.map(sourceDtoToModel),
    };
  }

  async getSource(sourceId: string): Promise<Source> {
    const resp = await fetch(new URL(`sources/${sourceId}`, this.baseURL));
    const source = await resp.json();
    return sourceDtoToModel(source);
  }

  async addSources(ghLink: string): Promise<Source> {
    const formData = new FormData();
    formData.append("link", ghLink);

    const resp = await fetch(new URL(`sources/`, this.baseURL), {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    return sourceDtoToModel(await resp.json());
  }
}

function sourceDtoToModel(body: any): Source {
  const releases = (body.releases || []).map(releaseDtoToModel);

  return {
    ...body,
    releases,
    minReleasePublishedAt: d3.min(releases, getPublishedAt) ?? null,
    maxReleasePublishedAt: d3.max(releases, getPublishedAt) ?? null,
  };
}

function releaseDtoToModel(body: any): Release {
  return {
    ...body,
    publishedAt: new Date(body.publishedAt),
  };
}
