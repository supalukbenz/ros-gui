<template>
  <div>
    <div v-for="(m, index) in info.members" :key="index" class="flex flex-row mt-2 mr-2 w-full">
      <div class="w-full" v-if="m.members">
        <span v-show="index !== 0"><hr /></span>
        <div class="text-left font-bold -mb-2">{{ m.name }}</div>
        <type-childe-form
          :info="m"
          :parentList="parent"
          :parentName="m.name"
          :editedVariable="editedVariable"
          :dataObj="setVariableFormObf(m.name)"
        ></type-childe-form>
      </div>
      <div class="flex flex-row items-center justify-between w-full" v-else>
        <div class="fond-bold mr-2" v-if="info.members.length > 1">
          {{ m.name }}
          <span v-if="m.length > 0">{{ m.length }}</span>
        </div>
        <div>
          <div v-if="getInputType(m.type) === 'bool'">
            <input :name="m.name" type="checkbox" @change="setVariable(m.name, m.type, $event)" />
          </div>
          <div v-else>
            <input
              class="border pl-2"
              :name="m.name"
              :type="getInputType(m.type)"
              :placeholder="m.type"
              @change="setVariable(m.name, m.type, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TypeNodeForm from '@/components/buttonTool/TypeNodeForm.vue';
import { mapGetters } from 'vuex';
// import _ from 'lodash';

export default {
  name: 'type-childe-form',
  components: {
    'type-childe-form': TypeNodeForm,
  },
  data() {
    return {
      variables: {},
      currentValue: null,
      parent: [],
      currentVariable: {},
    };
  },
  props: {
    info: Object,
    parentList: Array,
    parentName: String,
    dataObj: Object,
    editedVariable: Object,
  },
  async created() {
    if (this.parentList !== undefined) {
      if (this.parentList.length > 0) {
        this.parent = await this.parentList;
      }
    }
    if (this.parentName !== undefined) {
      this.parent.push(this.parentName);
      this.variables = this.dataObj;
    }
  },
  computed: {
    ...mapGetters({
      variableList: 'getVariableList',
    }),
  },
  methods: {
    setVariableFormObf(name) {
      if (this.variables[name] === undefined) {
        this.variables[name] = {};
      }
      return this.variables[name];
    },
    setKeyVariable(acc, cur) {
      this.variables[cur] = acc;
    },
    setVariable(name, type, event) {
      let value = event.target.value;
      this.parent.push(name);
      let currentVariableList = this.variableList;
      if (this.getInputType(type) === 'number') {
        value = Number(value);
      }
      const variable = this.parent.reduceRight(
        (acc, cur) => ({
          [cur]: acc,
        }),
        value
      );

      currentVariableList.push(variable);
      this.parent.pop();
      this.$store.dispatch('updateVariableList', currentVariableList);
    },
    updateVariable(name) {
      if (this.editedVariable !== undefined) {
        let tempParent = this.parent;
        tempParent.push(name);
        // let value = _.get(this.editedVariable, tempParent);
        let value = 1;
        tempParent.pop();
        if (value) {
          return value;
        }
      }
      return null;
    },
    getInputType(type) {
      const numbers = [
        'int8',
        'uint8',
        'int16',
        'uint16',
        'int32',
        'uint32',
        'int64',
        'uint64',
        'float32',
        'float64',
      ];
      if (numbers.includes(type)) {
        return 'number';
      }
      return type;
    },
  },
};
</script>
