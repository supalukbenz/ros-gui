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
            <input :name="m.name" type="checkbox" />
          </div>
          <div v-else>
            <input
              class="border pl-2"
              :name="m.name"
              :type="getInputType(m.type)"
              :placeholder="m.type"
              v-model="variables[m.name]"
              @change="setVariable(m.name, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TypeNodeForm from '@/components/buttonTool/TypeNodeForm.vue';
export default {
  name: 'type-childe-form',
  components: {
    'type-childe-form': TypeNodeForm,
  },
  data() {
    return {
      variables: {},
      parent: [],
    };
  },
  props: {
    info: Object,
    parentList: Array,
    parentName: String,
    dataObj: Object,
  },
  async created() {
    console.log('created parent', this.parentName);
    console.log('dataObj', this.dataObj);
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
  computed: {},
  methods: {
    setVariableFormObf(name) {
      if (this.variables[name] === undefined) {
        this.variables[name] = {};
      }
      return this.variables[name];
    },
    setVariable(name, event) {
      console.log('name', name);
      const value = event.target.value;
      this.parent.push(name);
      console.log(value);
      console.log('this.parent', this.parent);
      console.log('this.parentList', this.parentList);
      let dataForm = {};
      // const mapData = this.parent.map(key => {
      //   dataForm[key] =
      // })
      // this.parent.forEach((n, index) => {
      //   if (dataForm[n] === undefined) {
      //     dataForm[n] = {};
      //   }
      //   if (index === this.parent.length - 1) {
      //     dataForm[n] = value;
      //   } else {
      //     dataForm = dataForm[n];
      //   }
      // });

      for (let i = this.parent.length - 1; i >= 0; i--) {
        if (i === this.parent.length - 1) {
          dataForm[this.parent[i]] = value;
        } else {
          dataForm[this.parent[i]] = dataForm;
        }
        console.log(this.parent[i]);
      }

      console.log('dataForm', dataForm);
      // if (value === '') {
      //   if (this.parentName === undefined) {
      //     delete this.variables[name];
      //   } else {
      //     delete this.variables[this.parentName][name];
      //   }
      // } else {
      //   if (this.parentName === undefined) {
      //     this.variables[name] = value;
      //   } else {
      //     this.variables[this.parentName].name = value;
      //   }
      // }
      // console.log(this.variables);
    },
    updateVariable(name, event) {
      console.log(name, event.target.value);
      console.log(this.variables);
      console.log('updateVariable');
      console.log('this.parent', this.parent);
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
