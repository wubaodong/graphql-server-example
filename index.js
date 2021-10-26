const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Project {
    id: Int
    name: String
    actions(actionName: String, actionType: Int!): [Action]
  }

  type Action {
    id: Int
    name: String
    type: Int
    setting: ClockSyncSetting
  }

  type ClockSyncSetting {
    devices(deviceName: String, aliasName: String): [Device]
  }

  type Device {
    name: String
    alias: String
  }

  type Query {
    project(id: Int!): Project
  }
`;

const projects = [
  {
    id: 1,
    name: "Localhost1",
    actions: [
      {
        id: 1,
        name: "action1",
        type: 1,
        setting: {
          devices: [
            {
              name: "device1",
              alias: "device alias 1",
            },
            {
              name: "device2",
              alias: "device alias 2",
            },
          ],
        },
      },
      {
        id: 2,
        name: "action2",
        type: 1,
        setting: {
          devices: [
            {
              name: "device3",
              alias: "device alias 3",
            },
            {
              name: "device4",
              alias: "device alias 4",
            },
          ],
        },
      },
      {
        id: 3,
        name: "action3",
        type: 2,
        setting: {
          devices: [
            {
              name: "device5",
              alias: "device alias 5",
            },
            {
              name: "device6",
              alias: "device alias 6",
            },
          ],
        },
      },
    ],
  },
  {
    id: 2,
    name: "Localhost2",
  },
];


const resolvers = {
  Query: {
    project(parent, args, context, info) {
      return projects.find((project) => project.id === args.id);
    },
  },
  Project: {
    actions(parent, args, context, info) {
        let actions = parent.actions;
        return actions ? actions.filter(action => action.type === args.actionType
            && (args.actionName && action.name.includes(args.actionName)
                || !args.actionName)) : [];
    }
  },
  Action: {
    name(parent, args, context, info) {
        console.log(parent)
        console.log(args)
        return "null";
    }
  },
  ClockSyncSetting: {
    devices(parent, args, context, info) {
        let devices = parent.devices;
        if (args.aliasName) {
            return devices.filter(device => device.alias.includes(args.aliasName));
        } else if (args.deviceName) {
            return devices.filter(device => device.name.includes(args.deviceName));
        }
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
