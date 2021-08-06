<template>
  <div>
    <div class="flex flex-col min-w-35">
      <div class="flex flex-row justify-between">
        <div class="w-100">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">1st</a>
            </li>
          </ul>
        </div>
        <div class="border w-52"></div>
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
import { DataSet, Network } from 'vis';
// import { Ros } from 'roslib';
// import { Network } from 'vue-vis-network';

export default {
  data() {
    return {
      countTab: 1,
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
    }),
  },
  mounted() {
    if (this.ros) {
      this.updateROSGraph();
      console.log('this.ros', this.ros);
      console.log('this.ros.getNodeDetails', this.ros.getNodeDetails);
      setInterval(() => {
        this.updateROSGraph();
      }, 1000);
      console.log('this.nodes ', this.nodes);
      this.nodes = new DataSet([]);
      console.log('this.nodes 2: ', this.nodes);
      this.edges = new DataSet([]);
      // this.ros.on('connection', () => {
      //   console.log('ros connected');
      //   this.updateROSGraph();
      //   setInterval(() => {
      //     this.updateROSGraph();
      //   }, 1000);
      // });
      let data = {
        nodes: this.nodes,
        edges: this.edges,
      };
      let container = document.getElementById('container');
      this.network = new Network(container, data, this.options);
    }
  },
  methods: {
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
</style>
