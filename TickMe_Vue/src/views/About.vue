<template>
  <div class="about">
    <img class="logo" src="@/assets/icons/Logo.png" alt="Logo" />
	<p style="font-size: 3.125rem;font-weight: 700;color: var(--Gray-8);">Tick Me</p>
    <!-- <svg-icon icon-class="Logo" class="logo-text"></svg-icon> -->
    <span class="version">Version 0.2.0</span>
    <div class="info-box">
      <!-- <svg-icon icon-class="Logo" style="width: 2rem"></svg-icon> -->
      <p class="info">TickMe是我的WebApp任务管理的初尝试，十分简单但对我来说遍布惊喜。</p>
    </div>
    <div class="footer">
      <ul class="">
        <h4>暂未完成的功能</h4>
        <li>账号登录(已完成)</li>
        <li>搜索</li>
        <li>可自定义的分类功能</li>
      </ul>
      <ul>
        <h4>未来可能添加的功能（特性）</h4>
        <li>云同步(20%)</li>
        <li>深色模式(已完成)</li>
      </ul>
    </div>
  </div>
</template>
<script>
	export default{
		name:'About',
		mounted() {
			this.$emit('hideSearchBar', false)
		},
	}
</script>
<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin: 0 2rem; */
  height: 100vh;
}
.logo {
  width: 12rem;
  height: 12rem;
  margin: 4rem 0 1.5rem 0;
}
.logo-text {
  color: var(--Gray-8);
  width: 6.875rem;
  height: 3.25rem;
  margin: 0 0 2rem 0;
}
.version {
  color: var(--Gray-5);
  line-height: 2rem;
}
.info-box {
  display: flex;
  align-items: center;
  margin-bottom: 5rem;
}
.info {
  margin-left: .5rem;
  color: var(--Gray-8);
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 1px;
}
.footer {
  display: flex;
  justify-content: space-between;
  width: 24rem;
}
ul {
  color: var(--Gray-7);
  font-size: 0.75rem;
  line-height: 1.5rem;
}
h4 {
  font-weight: 500;
  margin-bottom: 0.5rem;
}
li {
  list-style: none;
}
</style>
