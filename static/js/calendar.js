---
---
/* Calendar view. Loaded after main.js on calendar.html.
   main.js owns the deadline-type choice and the tag filtering; this file only
   draws the month grid for whatever main.js is currently showing. */
$(function() {
  var conferenceDates = {};

  {% for conf in site.data.conferences %}
  {% assign num_deadlines = conf.deadline.size %}
  {% if num_deadlines == 0 %}
    {% assign num_deadlines = 1 %}
  {% endif %}
  {% assign range_end = num_deadlines | minus: 1 %}
  {% for i in (0..range_end) %}
  {% assign conf_id = conf.name | append: conf.year | append: '-' | append: i | slugify %}
  conferenceDates["{{ conf_id }}"] = {
    name: {{ conf.name | jsonify }},
    year: {{ conf.year | jsonify }},
    link: {{ conf.link | jsonify }},
    description: {{ conf.description | jsonify }},
    place: {{ conf.place | jsonify }},
    round: {{ i | plus: 1 }},
    roundCount: {{ num_deadlines }},
    timezone: {{ conf.timezone | default: 'Etc/GMT+12' | jsonify }},
    abstract: {{ conf.abstract_deadline[i] | jsonify }},
    full_paper: {{ conf.full_paper_deadline[i] | jsonify }},
    first_round_decision: {{ conf.first_round_decision[i] | jsonify }}
  };
  {% endfor %}
  {% endfor %}

  var WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var AREA_TAGS = ['NS', 'SP', 'TAI', 'MISC'];
  var cursor = moment().startOf('month');
  var view = 'list';

  var $confContainer = $('.conf-container');
  var $calView = $('#cal-view');
  var $grid = $('#cal-grid');

  function selectedDeadlineType() {
    return $('.deadline-type-toggle.active').data('deadline-type') || 'abstract';
  }

  // main.js hides filtered-out conferences inline, so its tag filtering is
  // simply read back off the DOM instead of being reimplemented here.
  function visibleDeadlines() {
    var deadlineType = selectedDeadlineType();
    var events = [];

    $('.conf').each(function(_, element) {
      if (element.style.display === 'none') return;

      var data = conferenceDates[element.id];
      if (!data) return;

      var parsed = moment.tz(data[deadlineType] || '', data.timezone);
      if (!data[deadlineType] || !parsed.isValid()) return;

      var when = parsed.local();
      events.push({
        data: data,
        area: areaOf(element),
        when: when,
        dayKey: when.format('YYYY-MM-DD')
      });
    });

    return events.sort(function(a, b) { return a.when.valueOf() - b.when.valueOf(); });
  }

  // Conferences carry their research area as a class (see index.html), so the
  // chip colour comes straight off the element main.js already filtered.
  function areaOf(element) {
    for (var i = 0; i < AREA_TAGS.length; i++) {
      if (element.classList.contains(AREA_TAGS[i])) return AREA_TAGS[i];
    }
    return 'OTHER';
  }

  function conferenceLabel(data) {
    var label = data.name + ' ' + data.year;
    return data.roundCount >= 2 ? label + ' (' + data.round + '/' + data.roundCount + ')' : label;
  }

  function tooltip(event) {
    var lines = [conferenceLabel(event.data), event.when.format('D MMM YYYY, h:mm a')];
    if (event.data.description) lines.push(event.data.description);
    if (event.data.place) lines.push(event.data.place);
    return lines.join('\n');
  }

  function renderGrid() {
    var byDay = {};
    var events = visibleDeadlines();
    events.forEach(function(event) {
      (byDay[event.dayKey] = byDay[event.dayKey] || []).push(event);
    });

    var monthStart = cursor.clone().startOf('month');
    var day = monthStart.clone().startOf('isoWeek');
    var gridEnd = cursor.clone().endOf('month').endOf('isoWeek');
    var today = moment().format('YYYY-MM-DD');
    var monthCount = 0;

    $grid.empty();

    while (day.isSameOrBefore(gridEnd, 'day')) {
      var dayKey = day.format('YYYY-MM-DD');
      var dayEvents = byDay[dayKey] || [];
      var inMonth = day.isSame(monthStart, 'month');
      if (inMonth) monthCount += dayEvents.length;

      var $cell = $('<div class="cal-day"></div>');
      if (!inMonth) $cell.addClass('other-month');
      if (dayKey === today) $cell.addClass('is-today');
      if (dayKey < today) $cell.addClass('is-past');

      $cell.append($('<span class="cal-daynum"></span>').text(day.date()));

      dayEvents.forEach(function(event) {
        var $chip = $('<a class="cal-ev" target="_blank" rel="noopener noreferrer"></a>')
          .addClass('cal-ev-' + event.area)
          .attr('href', event.data.link || '#')
          .attr('title', tooltip(event))
          .text(conferenceLabel(event.data));
        $cell.append($chip);
      });

      $grid.append($cell);
      day.add(1, 'day');
    }

    $('#cal-title').text(cursor.format('MMMM YYYY'));
    $('#cal-count').text(monthCount === 0
      ? 'no deadlines this month'
      : monthCount + (monthCount === 1 ? ' deadline' : ' deadlines') + ' this month');
  }

  function render() {
    if (view === 'calendar') renderGrid();
  }

  function setView(nextView) {
    view = nextView;
    $('.view-toggle')
      .removeClass('active')
      .attr('aria-pressed', 'false')
      .filter('[data-view="' + nextView + '"]')
      .addClass('active')
      .attr('aria-pressed', 'true');

    $confContainer.toggle(nextView === 'list');
    $calView.prop('hidden', nextView !== 'calendar');
    render();
  }

  $('.view-toggle').on('click', function() {
    setView($(this).data('view'));
  });

  // These handlers run after main.js's, so the DOM already reflects the new
  // deadline type / tag selection by the time the grid is redrawn.
  $('.deadline-type-toggle').on('click', render);
  $('form :checkbox').on('change', render);

  $('#cal-prev').on('click', function() {
    cursor = cursor.clone().subtract(1, 'month');
    render();
  });

  $('#cal-next').on('click', function() {
    cursor = cursor.clone().add(1, 'month');
    render();
  });

  $('#cal-today').on('click', function() {
    cursor = moment().startOf('month');
    render();
  });

  var $weekdays = $('#cal-weekdays');
  WEEKDAYS.forEach(function(name) {
    $weekdays.append($('<div class="cal-weekday"></div>').text(name));
  });

  setView('list');
});
