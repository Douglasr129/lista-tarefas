<template>
  <v-card class="mx-auto" max-width="365">
    <v-toolbar color="light-blue" extended light>
      <v-toolbar-title>Minhas Tarefas</v-toolbar-title>
      <v-spacer />
      <v-btn color="grey-darken-4" icon="mdi-magnify" />
      <template #extension>
        <v-fab class="ms-4" color="cyan-accent-2" icon="mdi-plus" location="bottom left" size="40" absolute offset @click="dialog = !dialog" />
      </template>
    </v-toolbar>

    <v-list lines="two" subheader>
      <v-list-subheader title="Folders" inset />

      <v-list-item v-for="item in items" :key="item.title" link>
        <template #prepend>
          <v-avatar :class="[item.iconClass]" :icon="item.icon" />
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>

        <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>

        <template #append>
          <v-list-item-action>
            <v-btn color="grey-lighten-1" icon="mdi-information" variant="text" />
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <v-text-field label="File name" />

          <small class="text-grey">* This doesn't actually save.</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="dialog = false">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)
const items = ref([
  { icon: 'mdi-folder', iconClass: 'bg-grey-lighten-1 text-white', title: 'Photos', subtitle: 'Jan 9, 2014' },
  { icon: 'mdi-folder', iconClass: 'bg-grey-lighten-1 text-white', title: 'Recipes', subtitle: 'Jan 17, 2014' },
  { icon: 'mdi-folder', iconClass: 'bg-grey-lighten-1 text-white', title: 'Work', subtitle: 'Jan 28, 2014' },
])
</script>
