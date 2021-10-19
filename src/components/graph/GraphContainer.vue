<template>
  <div>
    <div class="flex flex-col">
      <div class="flex flex-row justify-between">
        <div class="w-100">
          <ul class="nav nav-tabs">
            <li v-for="tab in countTab" :key="tab" class="nav-item w-20">
              <a
                class="nav-link text-blue-custom font-bold"
                :class="[tabActive === tab ? 'active' : 'tab-color']"
                aria-current="page"
                href="#"
                >#{{ tab }}</a
              >
            </li>
            <li class="nav-item w-20">
              <a class="nav-link tab-color" aria-current="page" href="#" @click="addTab()"
                ><i class="fas fa-plus-circle"></i
              ></a>
            </li>
          </ul>
        </div>
        <div class="border w-64"></div>
      </div>
      <div class="h-96 border-b border-l border-r">
        <div v-if="ros" id="container">
          <!-- <network ref="network" :nodes="nodes" :edges="edges" :options="options"> </network> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import { DataSet, Network } from 'vis';
// import { Ros } from 'roslib';
// import { Network } from 'vue-vis-network';

export default {
  data() {
    return {
      countTab: 1,
      tabActive: 1,
      nodes_t: [],
      edges_t: [],
      options: {},
      network: null,
      nodes: null,
      edges: null,
      excluded: ['rosout', 'rosapi', 'rosout_agg'],
    };
  },
  components: {
    // Network,
  },
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
      ros: 'getROS',
      rosbridgeURL: 'getRosbridgeURL',
    }),
  },
  async mounted() {
    // if (this.ros) {
    //   await this.ros.connect(this.rosbridgeURL);
    //   this.updateROSGraph();
    //   console.log('this.ros', this.ros);
    //   console.log('this.ros.getNodeDetails', this.ros.getNodeDetails);
    //   setInterval(() => {
    //     this.updateROSGraph();
    //   }, 1000);
    //   console.log('this.nodes ', this.nodes);
    //   this.nodes = new DataSet([]);
    //   console.log('this.nodes 2: ', this.nodes);
    //   this.edges = new DataSet([]);
    //   let data = {
    //     nodes: this.nodes,
    //     edges: this.edges,
    //   };
    //   let container = document.getElementById('container');
    //   this.network = new Network(container, data, this.options);
    // }
  },
  methods: {
    addTab() {
      console.log('add ');
      this.countTab = this.countTab + 1;
    },
    isEmptyObject(obj) {
      return Object.keys(obj).length === 0;
    },
    getNodeInfo(nodes) {
      return nodes.reduce((promiseChain, node) => {
        this.nodes_t.push({
          id: node + '_n',
          label: node,
        });

        return promiseChain.then(
          () =>
            new Promise(resolve => {
              this.ros.getNodeDetails(node, res => {
                res.publishing.forEach(topic => {
                  if (this.nodes_t.map(e => e.id).indexOf(topic + '_t') < 0)
                    this.nodes_t.push({
                      id: topic + '_t',
                      label: topic,
                      shape: 'box',
                    });
                  this.edges_t.push({
                    from: node + '_n',
                    to: topic + '_t',
                    arrows: 'to',
                  });
                });
                res.subscribing.forEach(topic => {
                  if (this.nodes_t.map(e => e.id).indexOf(topic + '_t') < 0)
                    this.nodes_t.push({
                      id: topic + '_t',
                      label: topic,
                      shape: 'box',
                    });
                  this.edges_t.push({
                    to: node + '_n',
                    from: topic + '_t',
                    arrows: 'to',
                  });
                });
                resolve();
              });
            })
        );
      }, Promise.resolve());
    },
    updateROSGraph() {
      this.nodes_t = [];
      this.edges_t = [];

      this.ros.getNodes(async nodes => {
        await this.getNodeInfo(nodes);
        this.nodes.forEach(node => {
          if (this.nodes_t.map(e => e.id).indexOf(node.id) < 0) {
            this.nodes.remove(node);
          }
        });

        this.nodes_t.forEach(node => {
          if (this.nodes.map(e => e.id).indexOf(node.id) < 0) {
            this.nodes.add(node);
          }
        });

        this.nodes.forEach(node => {
          if (this.excluded.indexOf(node.label.split('/').slice(-1)[0]) >= 0) {
            this.nodes.remove(node);
          }
        });

        this.edges.forEach(edge => {
          if (this.edges_t.map(e => e.id).indexOf(edge.id) < 0) {
            this.edges.remove(edge);
          }
        });

        this.edges_t.forEach(edge => {
          if (this.edges.map(e => e.id).indexOf(edge.id) < 0) {
            this.edges.add(edge);
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.min-w-35 {
  min-width: 35rem;
}

.tab-color {
  background: #3f13a6;
  color: #ffffff !important;
  font-weight: 600;
  border: 1px solid #dee2e6 !important;
}

.tab-color:hover {
  color: #3f13a6 !important;
  background: #ffffff;
}

.text-blue-custom {
  color: #3f13a6;
}
</style>
