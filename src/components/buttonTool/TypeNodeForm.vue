<template>
  <div>
    <div v-for="(m, index) in info.members" :key="index" class="flex flex-row mt-2 mr-2">
      <div v-if="m.members">
        <strong>{{ m.name }}</strong>
        <type-childe-form :info="m"></type-childe-form>
      </div>
      <div v-else>
        <small class="text-muted" v-if="info.members.length > 1">
          {{ m.name }}
          <span v-if="m.length > 0">{{ m.length }}</span>
        </small>
        <div class="input-group">
          <div v-if="getInputType(m.type) === 'checkbox'">
            <input class="form-control" :name="m.name" type="checkbox" />
          </div>
          <div v-else>
            <input
              class="form-control"
              :name="m.name"
              :type="getInputType(m.type)"
              :placeholder="m.type"
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
  props: {
    info: Object,
  },
  methods: {
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
