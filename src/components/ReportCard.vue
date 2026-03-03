<template>
  <div class="report-card"
       :class="cardKey"
       :style="{ '--accent': color }">
    <div class="card-top-bar" />
    <div class="card-title">{{ title }}</div>
    <div class="card-value">{{ value }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [String, Number],
  color: String,
  cardKey: String
})
</script>

<style lang="scss">
.report-card {
  background: rgba(19, 22, 30, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 22px 20px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(19, 22, 30, 0.10);
  }

  .card-top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    border-radius: 2px 2px 0 0;
  }

  .card-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b7490;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-value {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
    color: var(--accent);
  }

  &.total_tickets {
    background: linear-gradient(135deg, #10b981 0%, #065f46 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);

    .card-title { color: rgba(255, 255, 255, 0.65); }
    .card-value { color: #fff; }
    .card-top-bar { display: none; }
  }

  &.total_revenue {
    background: linear-gradient(135deg, #06b6d4 0%, #164e63 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);

    .card-title { color: rgba(255, 255, 255, 0.65); }
    .card-value { color: #fff; }
    .card-top-bar { display: none; }
  }
}
</style>
