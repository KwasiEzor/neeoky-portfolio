import React, { useEffect, useState } from 'react';
import { Card, Heading, Stack, Box, Text, Flex, Badge, Button } from '@sanity/ui';
import { client } from '../sanity.config';

export function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type == "lead"] | order(_createdAt desc) [0...10] {
      _id,
      _createdAt,
      firstName,
      lastName,
      email,
      projectType,
      budget,
      status,
      priority
    }`;

    client
      .fetch(query)
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leads:', error);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { tone: 'primary', label: '🆕 Nouveau' },
      in_progress: { tone: 'caution', label: '👀 En cours' },
      contacted: { tone: 'positive', label: '📞 Contacté' },
      quoted: { tone: 'positive', label: '💰 Devis' },
      converted: { tone: 'positive', label: '✅ Converti' },
      archived: { tone: 'default', label: '❌ Archivé' },
    };

    const config = statusConfig[status] || statusConfig.new;
    return <Badge tone={config.tone}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { tone: 'critical', label: '🔴 Haute' },
      medium: { tone: 'caution', label: '🟡 Moyenne' },
      low: { tone: 'default', label: '🟢 Basse' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge tone={config.tone} mode="outline">{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card padding={4}>
        <Heading size={2}>📨 Dernières Demandes</Heading>
        <Box marginTop={3}>
          <Text>Chargement...</Text>
        </Box>
      </Card>
    );
  }

  return (
    <Card padding={4}>
      <Flex align="center" justify="space-between" marginBottom={4}>
        <Heading size={2}>📨 Dernières Demandes</Heading>
        <Button
          text="Voir tout"
          mode="ghost"
          onClick={() => {
            // Navigate to leads list
            window.location.href = '/desk/lead';
          }}
        />
      </Flex>

      {leads.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent">
          <Text align="center" muted>
            Aucune demande pour le moment
          </Text>
        </Card>
      ) : (
        <Stack space={3}>
          {leads.map((lead) => (
            <Card
              key={lead._id}
              padding={3}
              radius={2}
              shadow={1}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => {
                window.location.href = `/desk/lead;${lead._id}`;
              }}
            >
              <Flex direction="column" gap={2}>
                {/* Header */}
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={2}>
                    <Text size={2} weight="bold">
                      {lead.firstName} {lead.lastName}
                    </Text>
                    {getStatusBadge(lead.status)}
                  </Flex>
                  <Text size={1} muted>
                    {formatDate(lead._createdAt)}
                  </Text>
                </Flex>

                {/* Details */}
                <Flex gap={3} wrap="wrap">
                  <Text size={1} muted>
                    📧 {lead.email}
                  </Text>
                  {lead.projectType && (
                    <Text size={1} muted>
                      🎯 {lead.projectType}
                    </Text>
                  )}
                  {lead.budget && (
                    <Text size={1} muted>
                      💰 {lead.budget}
                    </Text>
                  )}
                </Flex>

                {/* Priority */}
                {lead.priority && (
                  <Box>
                    {getPriorityBadge(lead.priority)}
                  </Box>
                )}
              </Flex>
            </Card>
          ))}
        </Stack>
      )}
    </Card>
  );
}

export default RecentLeads;
