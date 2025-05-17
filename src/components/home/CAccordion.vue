<template>
  <Toast />
  <div>
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" placeholder="Search" />
    </IconField>

    <Accordion :value="selectedValue">
      <AccordionPanel
        v-for="topic in paginatedTopics"
        :key="topic.guid"
        :value="topic.guid"
        @click="selectedValue = topic.guid"
      >
        <AccordionHeader>{{ topic.name }}</AccordionHeader>
        <AccordionContent>
          <div v-if="topic?.comments?.length" class="col-5">
            <comment-card
              v-for="(comment, index) in topic.comments"
              :key="index"
              :comment="comment"
              @delete-comment="deleteComment(topic.guid, index)"
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
      this.updatePaginatedTopics?.();
      this.$toast.add({
        severity: "success",
        summary: "Comment Deleted",
        detail: "The commnent has been deleted successfully",
        life: 3000,
      });
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
