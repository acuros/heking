{% extends "base.tpl" %}
{% block title %} | SQL Injection{% endblock %}
{% block head %}
{[{ super() }]}
<link rel="stylesheet" href="/css/sqlinjection.css" type="text/css">
<script src="/js/sqlinjection.js"></script>
{% endblock %}
{% block body %}<div id="wrap">{% block main %}{% endblock %}</div>{% endblock %}