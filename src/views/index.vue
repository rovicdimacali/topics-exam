<template>
  <div class="topics-container col">
    <h1>Threads</h1>
    <div class="accordion-container">
      <c-accordion :topics="topics" />
    </div>
  </div>
</template>

<script>
import { topicsService } from "@/services/topics";
import CAccordion from "@/components/home/CAccordion.vue";

export default {
  components: { CAccordion },
  data() {
    return {
      topics: null,
    };
  },

  methods: {
    async getTopics() {
      try {
        const response = await topicsService.getTopics();

        const personMap = {};
        response.persons.forEach((person) => {
          const fullName = `${person.first} ${person.last}`;
          person.profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName
          )}&background=random`;
          personMap[person.guid] = person;
        });
        response.topics.forEach((topic) => {
          topic.comments.forEach((comment) => {
            if (comment.by && personMap[comment.by]) {
              comment.by = personMap[comment.by];
            }
          });
        });

        const stored = JSON.parse(localStorage.getItem("topics"));
        if (!stored) {
          localStorage.setItem("topics", JSON.stringify(response.topics));
        }
        this.topics = stored
          ? stored
          : response.topics?.length
          ? response.topics
          : [];

        console.log(this.topics);
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    this.getTopics();
  },
};
</script>

<style></style>
