<template>
  <ConfirmPopup></ConfirmPopup>
  <div class="comment-card col-5">
    <div class="comment-header row-5">
      <div class="user-info row-5">
        <img :src="comment.by.profilePic" alt="Threads User" />
        <p>{{ comment.by.first }} {{ comment.by.last }}</p>
      </div>
      <div class="menu-icon" @click="openMenu">
        <i class="pi pi-ellipsis-h"></i>
      </div>
    </div>

    <div class="comment col-10">
      <div v-if="isUpdateVisible" class="update-field col-5">
        <Textarea v-model="selectedComment" autoResize rows="5" cols="30" />
        <div class="row-5">
          <Button
            icon="pi pi-times"
            size="small"
            outlined
            severity="secondary"
            label="Cancel"
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

      <p>{{ comment.comment }}</p>
      <small>{{ formatDate(comment.date) }}</small>
    </div>
  </div>
</template>

<script>
export default {
  props: ["key", "comment"],
  data() {
    return {
      selectedComment: null,
      isUpdateVisible: false,
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    openMenu(event) {
      this.$confirm.require({
        target: event.currentTarget,
        rejectProps: {
          label: "Update",
          severity: "info",
          outlined: true,
          icon: "pi pi-pencil",
        },
        acceptProps: {
          label: "Delete",
          severity: "danger",
          outlined: true,
          icon: "pi pi-trash",
        },
        accept: () => {
          this.$emit("delete-comment");
        },
        reject: () => {
          this.isUpdateVisible = true;
        },
      });
    },

    update() {
      this.comment.comment = this.selectedComment;
      this.isUpdateVisible = false;
      this.$toast.add({
        severity: "success",
        summary: "Comment Updated",
        detail: "The commnent has been updated successfully",
        life: 3000,
      });
    },
  },

  mounted() {
    this.selectedComment = this.comment?.comment;
  },
};
</script>

<style></style>
