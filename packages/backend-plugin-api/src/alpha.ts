/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  BackendFeature,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { Handler, Request } from 'express';

/** @alpha */
export interface FeatureDiscoveryService {
  getBackendFeatures(): Promise<{ features: Array<BackendFeature> }>;
}

/**
 * An optional service that can be used to dynamically load in additional BackendFeatures at runtime.
 * @alpha
 */
export const featureDiscoveryServiceRef =
  createServiceRef<FeatureDiscoveryService>({
    id: 'core.featureDiscovery',
    scope: 'root',
  });

/**
 * @alpha
 */
export type BackstageCredentials = {
  token: string;

  scope?: 'static-assets'[];

  user?: {
    userEntityRef: string;
    ownershipEntityRefs: string[];
  };

  service?: {
    id: string;
  };
};

/** @alpha */
export interface AuthService {
  authenticate(token: string): Promise<BackstageCredentials>;

  issueToken(credentials: BackstageCredentials): Promise<{ token: string }>;
}

/**
 * A service for authenticating and issuing tokens.
 * @alpha
 */
export const authServiceRef = createServiceRef<AuthService>({
  id: 'core.auth',
});

/** @alpha */
type AuthTypes = 'user' | 'user-cookie' | 'service' | 'unauthorized';

/** @alpha */
export interface HttpAuthServiceMiddlewareOptions {
  allow: AuthTypes[];
}

/** @alpha */
export interface HttpAuthService {
  createHttpPluginRouterMiddleware(): Handler;

  middleware(options?: HttpAuthServiceMiddlewareOptions): Handler;

  credentials(
    req: Request,
    options?: HttpAuthServiceMiddlewareOptions,
  ): BackstageCredentials;

  requestHeaders(credentials: BackstageCredentials): Record<string, string>;

  issueUserCookie(res: Response): Promise<void>;
}

/**
 * A service for authenticating and authorizing HTTP requests.
 * @alpha
 */
export const httpAuthServiceRef = createServiceRef<HttpAuthService>({
  id: 'core.httpAuth',
});
