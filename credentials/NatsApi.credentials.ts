import type { ICredentialType, INodeProperties } from 'n8n-workflow';
import { defaultJsOptions } from 'nats/lib/jetstream/jsbaseclient_api';
import { defaultOptions } from 'nats/lib/nats-base-client/options';

const DefaultOptions = defaultOptions()
const DefaultJsOptions = defaultJsOptions()

export class NatsApi implements ICredentialType {
	name = 'natsApi';

	displayName = 'NATS API';

	properties: INodeProperties[] = [
		{
			displayName: 'Client Name',
			name: 'name',
			type: 'string',
			default: DefaultOptions.name,
			placeholder: 'Client Name',
			description: 'Sets the client name. When set, the server monitoring pages will display this name when referring to this client.'
		},

		// Server connection
		{
			displayName: 'Servers',
			name: 'servers',
			type: 'string',
			default: DefaultOptions.servers,
			placeholder: 'nats://nats1:4222,nats://nats2:4222,nats://nats3:4222',
			description: 'Set the hostport(s) where the client should attempt to connect.'
		},
		{
			displayName: 'Enable TLS',
			name: 'tlsEnabled',
			type: 'boolean',
			default: false,
			placeholder: 'Enable TLS',
			description: 'When set to true, TLS will be enabled for the connection.'
		},
		{
			displayName: 'CA Cert',
			name: 'tlsCa',
			type: 'string',
			default: undefined,
			placeholder: 'PEM ca',
			description: 'TLS Certificate Authority',
      		typeOptions: {
				rows: 4,
				alwaysOpenEditWindow: true
			},
			displayOptions: {
				show: {
					tlsEnabled: [true]
				}
			}
		},

		// Server authentification
		{
      displayName: 'Authentication Type',
			name: 'authType',
			type: 'options',
			default: undefined,
			noDataExpression: true,
			required: true,
			description: 'https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro',
			options: [
				{
					name: 'None',
					value: 'none',
					description: 'No Authentication'
				},
				{
					name: 'Plain Text Username/Password credentials',
					value: 'user',
					description: 'authentication with username and password'
				},
				{
					name: 'Token Authentication',
					value: 'token',
					description: 'authentication with a token'
				},
				{
					name: 'TLS Certificate',
					value: 'tls',
					description: 'authentication with a tls certificate'
				},
				{
					name: 'NKEY with Challenge',
					value: 'nkey',
					description: 'authentication with a nkey challenge'
				},
				{
					name: 'Decentralized JWT Authentication',
					value: 'jwt',
					description: 'authentication with a jwt and nkey'
				},
				{
					name: 'Creds file',
					value: 'creds',
					description: 'authentication with a creds file'
				}
			]
		},
		{
			displayName: 'TLS Certificate',
			name: 'tlsCert',
			type: 'string',
			default: undefined,
			placeholder: 'PEM Cert',
			description: 'TLS Certificate',
			typeOptions: {
				alwaysOpenEditWindow: true,
				rows: 4,
			},
			displayOptions: {
				show: {
					authType: ['tls']
				}
			}
		},
		{
			displayName: 'TLS Key',
			name: 'tlsKey',
			type: 'string',
			typeOptions: {
				alwaysOpenEditWindow: true,
				rows: 4,
			},
			default: undefined,
			placeholder: 'PEM key',
			description: 'TLS Key',
			displayOptions: {
				show: {
					authType: ['tls']
				}
			}
		},
		{
			displayName: 'Username',
			name: 'user',
			type: 'string',
			default: DefaultOptions.user,
			placeholder: 'user',
			description: 'Sets the username for a client connection.',
			displayOptions: {
				show: {
					authType: ['user']
				}
			}
		},
		{
			displayName: 'Password',
			name: 'pass',
			type: 'string',
			typeOptions: { password: true },
			default: DefaultOptions.pass,
			placeholder: 'pass',
			description: 'Sets the password for a client connection.',
			displayOptions: {
				show: {
					authType: ['user']
				}
			}
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: DefaultOptions.token,
			placeholder: 'token',
			description: 'Set to a client authentication token. Note that these tokens are a specific authentication strategy on the nats-server.',
			displayOptions: {
				show: {
					authType: ['token']
				}
			}
		},
		{
			displayName: 'NKey',
			name: 'seed',
			type: 'string',
			typeOptions: { password: true },
			default: undefined,
			placeholder: 'NKEY',
			description: 'NKey seed',
			displayOptions: {
				show: {
					authType: ['nkey']
				}
			}
		},
		{
			displayName: 'NKey',
			name: 'jwtSeed',
			type: 'string',
			typeOptions: { password: true },
			default: undefined,
			placeholder: 'NKEY',
			description: 'NKey seed',
			displayOptions: {
				show: {
					authType: ['jwt']
				}
			}
		},
		{
			displayName: 'JWT',
			name: 'jwt',
			type: 'string',
			typeOptions: { password: true },
			default: undefined,
			placeholder: 'JWT',
			description: 'JWT token',
			displayOptions: {
				show: {
					authType: ['jwt']
				}
			}
		},

		{
			displayName: 'Creds',
			name: 'creds',
			type: 'string',
			typeOptions: {
				alwaysOpenEditWindow: true,
				password: true
			},
			default: undefined,
			placeholder: 'Creds content',
			description: 'Content of the creds file',
			displayOptions: {
				show: {
					authType: ['creds']
				}
			}
		},
		{
			displayName: 'Ignore auth error abort',
			name: 'ignoreAuthErrorAbort',
			type: 'boolean',
			default: DefaultOptions.ignoreAuthErrorAbort,
			placeholder: 'ignoreAuthErrorAbort',
			description: 'By default, NATS clients will abort reconnect if they fail authentication twice in a row with the same error, regardless of the reconnect policy. This option should be used with care as it will disable this behaviour when true.'
		},

		// JetStream specific
		{
			displayName: '[JetStream] API Prefix',
			name: 'jsApiPrefix',
			type: 'string',
			default: DefaultJsOptions.apiPrefix,
			placeholder: 'apiPrefix',
			description: 'Prefix required to interact with JetStream. Must match server configuration.'
		},
		{
			displayName: '[JetStream] Timeout',
			name: 'jsTimeout',
			type: 'number',
			default: DefaultJsOptions.timeout,
			placeholder: 'timeout',
			description: 'Number of milliseconds to wait for a JetStream API request.'
		},
		{
			displayName: '[JetStream] Domain',
			name: 'jsDomain',
			type: 'string',
			default: DefaultJsOptions.domain,
			placeholder: 'domain',
			description: 'Name of the JetStream domain. This value automatically modifies the default JetStream apiPrefix.'
		},


		// Ping
		{
			displayName: 'Max ping out',
			name: 'maxPingOut',
			type: 'number',
			default: DefaultOptions.maxPingOut,
			placeholder: 'maxPingOut',
			description: 'Sets the maximum count of ping commands that can be awaiting a response before rasing a stale connection status notification and initiating a reconnect.'
		},
		{
			displayName: 'Ping interval',
			name: 'pingInterval',
			type: 'number',
			default: DefaultOptions.pingInterval,
			placeholder: 'pingInterval',
			description: 'Sets the number of milliseconds between client initiated ping commands.'
		},

		// Reconnection
		{
			displayName: 'Reconnect',
			name: 'reconnect',
			type: 'boolean',
			default: DefaultOptions.reconnect,
			placeholder: 'reconnect',
			description: 'When set to true, the client will attempt to reconnect when the connection is lost.'
		},
		{
			displayName: 'Max reconnect attempts',
			name: 'maxReconnectAttempts',
			type: 'number',
			default: DefaultOptions.maxReconnectAttempts,
			placeholder: 'maxReconnectAttempts',
			description: 'Sets the maximum count of per-server reconnect attempts before giving up. Set to `-1` to never give up.'
		},
		{
			displayName: 'Reconnect jitter',
			name: 'reconnectJitter',
			type: 'number',
			default: DefaultOptions.reconnectJitter,
			placeholder: 'reconnectJitter',
			description: 'Set the upper bound for a random delay in milliseconds added to reconnectTimeWait.'
		},
		{
			displayName: 'Reconnect time wait',
			name: 'reconnectTimeWait',
			type: 'number',
			default: DefaultOptions.reconnectTimeWait,
			placeholder: 'reconnectTimeWait',
			description: 'Set the number of millisecods between reconnect attempts.'
		},
		{
			displayName: 'Timeout',
			name: 'timeout',
			type: 'number',
			default: DefaultOptions.timeout,
			placeholder: 'timeout',
			description: 'Sets the number of milliseconds the client should wait for a server handshake to be established.'
		},

		// Misc options
		{
			displayName: 'No echo',
			name: 'noEcho',
			type: 'boolean',
			default: DefaultOptions.noEcho,
			placeholder: 'noEcho',
		},
		{
			displayName: 'No randomize',
			name: 'noRandomize',
			type: 'boolean',
			default: DefaultOptions.noRandomize,
			placeholder: 'noRandomize',
			description: 'If set to true, the client will not randomize its server connection list.'
		},
		{
			displayName: 'Wait on first connect',
			name: 'waitOnFirstConnect',
			type: 'boolean',
			default: DefaultOptions.waitOnFirstConnect,
			placeholder: 'waitOnFirstConnect',
			description: 'When set to true, maxReconnectAttempts will not trigger until the client has established one connection.'
		},
		{
			displayName: 'Ignore cluster updates',
			name: 'ignoreClusterUpdates',
			type: 'boolean',
			default: DefaultOptions.ignoreClusterUpdates,
			placeholder: 'ignoreClusterUpdates',
			description: 'When set to true, cluster information gossiped by the nats-server will not augment the lists of server(s) known by the client.'
		},
		{
			displayName: 'Inbox prefix',
			name: 'inboxPrefix',
			type: 'string',
			default: DefaultOptions.inboxPrefix,
			placeholder: '_INBOX',
			description: 'A string prefix (must be a valid subject prefix) prepended to inboxes generated by client. This allows a client with limited subject permissions to specify a subject where requests can deliver responses.'
		},
		{
			displayName: 'Debug',
			name: 'debug',
			type: 'boolean',
			default: DefaultOptions.debug,
			placeholder: 'debug',
			description: 'When set to `true` the client will print protocol messages that it receives or sends to the server.'
		},
	];
}
