<template>
  <Toast />
  <div>
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" placeholder="Search" />
    </IconField>

    <Accordion :value="selectedValue">
      <AccordionPanel
        v-for="(topic, topicIndex) in paginatedTopics"
        :key="topic.guid"
        :value="topic.guid"
        @click="selectedValue = topic.guid"
      >
        <AccordionHeader>{{ topic.name }}</AccordionHeader>
        <AccordionContent>
          <div class="col-5" style="padding-bottom: 10px">
            <Button
              v-if="isUpdateVisible === false"
              icon="pi pi-pencil"
              size="small"
              outlined
              severity="info"
              label="Update Topic"
              @click="
                isUpdateVisible = true;
                selectedTopic = { ...topic };
              "
              style="width: fit-content"
            />
            <div v-if="isUpdateVisible" class="update-field row-5">
              <InputText v-model="selectedTopic.name" />
              <Button
                icon="pi pi-times"
                size="small"
                outlined
                severity="secondary"
                label="Cancel"
                @click="isUpdateVisible = false"
              />
              <Button
                icon="pi pi-send"
                size="small"
                outlined
                label="Submit"
                @click="update"
              />
            </div>
          </div>

          <div v-if="topic?.comments?.length" class="col-5">
            <comment-card
              v-for="(comment, commentIndex) in topic.comments"
              :key="commentIndex"
              :comment="comment"
              :topicIndex="topicIndex"
              :commentIndex="commentIndex"
              @delete-comment="deleteComment(topic.guid, commentIndex)"
            />
          </div>
          <small v-else>No comments available.</small>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <Paginator
      :rows="rows"
      :totalRecords="filteredTopics.length"
      :first="first"
      @page="onPageChange"
    />
  </div>
</template>

<script>
import CommentCard from "./CommentCard.vue";

export default {
  components: { CommentCard },
  props: ["topics"],
  data() {
    return {
      search: "",
      selectedValue: null,
      first: 0,
      rows: 20,
      paginatedTopics: [],
      isUpdateVisible: false,
      selectedTopic: false,
    };
  },
  computed: {
    filteredTopics() {
      if (!this.search?.trim()) return this.topics || [];

      const query = this.search.trim().toLowerCase();
      return (this.topics || []).filter((topic) =>
        topic.name?.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    onPageChange(event) {
      this.first = event.first;
    },
    updatePaginatedTopics() {
      this.paginatedTopics = this.filteredTopics.slice(
        this.first,
        this.first + this.rows
      );
    },
    deleteComment(topicGuid, commentIndex) {
      const topic = this.topics.find((t) => t.guid === topicGuid);
      if (topic && topic.comments) {
        topic.comments.splice(commentIndex, 1);
      }

      const storedTopics = JSON.parse(localStorage.getItem("topics"));
      const storedTopic = storedTopics?.find((t) => t.guid === topicGuid);
      if (storedTopic && storedTopic.comments) {
        storedTopic.comments.splice(commentIndex, 1);
        localStorage.setItem("topics", JSON.stringify(storedTopics));
      }

      this.updatePaginatedTopics?.();
      this.$toast.add({
        severity: "success",
        summary: "Comment Deleted",
        detail: "The comment has been deleted successfully",
        life: 3000,
      });
    },

    update() {
      if (!this.selectedTopic || !this.selectedTopic.guid) return;

      const index = this.topics.findIndex(
        (t) => t.guid === this.selectedTopic.guid
      );
      if (index !== -1) {
        const updatedTopic = {
          ...this.topics[index],
          name: this.selectedTopic.name,
        };

        this.topics.splice(index, 1, updatedTopic);

        const storedTopics = JSON.parse(localStorage.getItem("topics"));
        if (storedTopics) {
          const storedIndex = storedTopics.findIndex(
            (t) => t.guid === this.selectedTopic.guid
          );
          if (storedIndex !== -1) {
            storedTopics[storedIndex].name = this.selectedTopic.name;
            localStorage.setItem("topics", JSON.stringify(storedTopics));
          }
        }

        this.updatePaginatedTopics();
        this.isUpdateVisible = false;
        this.selectedTopic = null;

        this.$toast.add({
          severity: "success",
          summary: "Topic Updated",
          detail: "The topic name has been updated successfully",
          life: 3000,
        });
      }
    },
  },
  watch: {
    topics: {
      immediate: true,
      handler() {
        this.first = 0;
        this.updatePaginatedTopics();
      },
    },
    search() {
      this.first = 0;
      this.updatePaginatedTopics();
    },
    first() {
      this.updatePaginatedTopics();
    },
  },
};
</script>

<style></style>
